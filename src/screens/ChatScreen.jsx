import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { ArrowLeftIcon, PaperAirplaneIcon, TrashIcon } from "react-native-heroicons/outline";
import socket from "../services/socket";

const { height } = Dimensions.get("window");

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Connect to socket when component mounts
    socket.connect();

    // Join chat with user name
    socket.emit("newuser", userName);

    // Listen for group messages
    socket.on("group", (message) => {
      // Check if the message is a join/leave notification
      if (typeof message === "string") {
        // Add system message
        setMessages((prev) => [
          ...prev,
          {
            text: message,
            sender: "system",
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        // Add regular message
        setMessages((prev) => [
          ...prev,
          {
            text: message.text,
            sender: message.sender,
            timestamp: message.timestamp,
          },
        ]);
      }
      // Scroll to bottom after adding new message
      setTimeout(scrollToBottom, 100);
    });

    // Set typing indicator to always show for testing
    setIsTyping(true);

    // Cleanup on unmount
    return () => {
      socket.off("group");
      socket.off("typing");
    };
  }, [userName]);

  const handleTyping = () => {
    if (!isUserTyping) {
      setIsUserTyping(true);
      socket.emit("typing", { isTyping: true });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
      socket.emit("typing", { isTyping: false });
    }, 1000);
  };

  const clearChat = () => {
    Alert.alert("Clear Chat", "Are you sure you want to clear all messages?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setMessages([]);
          // Add a system message indicating chat was cleared
          setMessages([
            {
              text: "Chat history has been cleared",
              sender: "system",
              timestamp: new Date().toISOString(),
            },
          ]);
        },
      },
    ]);
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const messageData = {
        text: inputMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      // Emit message to server
      socket.emit("message", messageData);

      // Clear input
      setInputMessage("");

      // Clear typing status
      setIsTyping(false);

      // Scroll to bottom
      setTimeout(scrollToBottom, 100);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (error) {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  };

  const renderMessage = ({ item }) => {
    if (item.sender === "system") {
      return (
        <View style={styles.systemMessageContainer}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
          <Text style={styles.systemTimestamp}>{formatTimestamp(item.timestamp)}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, item.sender === "user" ? styles.userMessage : styles.agentMessage]}>
        <View style={[styles.messageBubble, item.sender === "user" ? styles.userBubble : styles.agentBubble]}>
          <Text style={[styles.messageText, item.sender === "user" ? styles.userMessageText : styles.agentMessageText]}>{item.text}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon size={24} color="#2874f0" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Customer Support</Text>
          <Text style={styles.headerSubtitle}>Online</Text>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearButton}>
          <TrashIcon size={24} color="#FF4444" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
        onScrollToIndexFailed={scrollToBottom}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        inverted={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Start a conversation with our support team</Text>
          </View>
        }
      />

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.typingContainer}>
          <View style={styles.typingBubble}>
            <ActivityIndicator size="small" color="#2874f0" style={styles.typingIndicator} />
            <Text style={styles.typingText}>Someone is typing...</Text>
          </View>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={(text) => {
            setInputMessage(text);
            // Emit typing status when there's text
            socket.emit("typing", { isTyping: !!text.trim() });
          }}
          placeholder="Type your message..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={!inputMessage.trim()}>
          <PaperAirplaneIcon size={24} color={inputMessage.trim() ? "#2874f0" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#4CAF50",
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80, // Add extra padding at bottom for better scrolling
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
  },
  agentMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#2874f0",
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  agentMessageText: {
    color: "#212121",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  systemMessageContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  systemTimestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  typingContainer: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 8,
  },
  typingIndicator: {
    marginRight: 8,
  },
  typingText: {
    color: "#666",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default ChatScreen;
