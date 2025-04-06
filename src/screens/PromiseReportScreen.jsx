import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput, Platform, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";

const PromiseReportScreen = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const [summaryData, setSummaryData] = useState({
    totalPromised: 0,
    totalUnauthorized: 0,
    totalPayment: 0,
    outstanding: 0,
  });
  const [currentTab, setCurrentTab] = useState("All");
  const [agents, setAgents] = useState(["All"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsIm1vYmlsZSI6Ijg4NTgwMDU3NTIiLCJpYXQiOjE3NDMyNDI4OTN9.i6_rdErZrXGuKwLBR_U29dpDuxi6puQ2FHjQS0bbGaQ";

      // Format dates as YYYY-MM-DD
      const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const data = JSON.stringify({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        orgid: 18,
        agent_id: 37,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api1.plusdistribution.in/pdpl-empl/get-promise-report-mobile",
        headers: {
          "x-auth-token": `"${token}"`, // Added quotes as in working config
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios(config);

      if (response.data && response.data.status === "ok") {
        setData(response.data.data || []);
        updateFilteredData(response.data.data || [], currentTab, selectedAgent, searchText);
        updateSummary(response.data.data || []);
        updateAgentsList(response.data.data || []);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        requestData: error.config?.data,
      });

      setData([]);
      setFilteredData([]);
      setSummaryData({
        totalPromised: 0,
        totalUnauthorized: 0,
        totalPayment: 0,
        outstanding: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSummary = (data) => {
    const summary = data.reduce(
      (acc, item) => ({
        totalPromised: acc.totalPromised + (item.TotalPromiseAmount || 0),
        totalUnauthorized: acc.totalUnauthorized + (item.NonAuthAmount || 0),
        totalPayment: acc.totalPayment + (item.TotalReceivingAmount || 0),
        outstanding: acc.outstanding + (item.RemainingAmount || 0),
      }),
      {
        totalPromised: 0,
        totalUnauthorized: 0,
        totalPayment: 0,
        outstanding: 0,
      }
    );
    setSummaryData(summary);
  };

  const updateAgentsList = (data) => {
    const uniqueAgents = ["All", ...new Set(data.map((item) => item.agent_name))];
    setAgents(uniqueAgents);
  };

  const paginateData = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const currentData = paginateData(filteredData, currentPage, itemsPerPage);

  const updateFilteredData = (data, tab, agent, search) => {
    let filtered = [...data];

    // Filter by tab
    if (tab === "Done") {
      filtered = filtered.filter((item) => item.TotalPromiseAmount > 0);
    } else if (tab === "Pending") {
      filtered = filtered.filter((item) => item.TotalPromiseAmount === 0);
    }

    // Filter by agent
    if (agent !== "All") {
      filtered = filtered.filter((item) => item.agent_name === agent);
    }

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (item) => item.ledger_name.toLowerCase().includes(search.toLowerCase()) || item.agent_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const onDateChange = (event, selectedDate, isStartDate) => {
    if (Platform.OS === "android") {
      setShowStartDate(false);
      setShowEndDate(false);
    }

    if (selectedDate) {
      if (isStartDate) {
        setStartDate(selectedDate);
        setShowStartDate(false);
      } else {
        setEndDate(selectedDate);
        setShowEndDate(false);
      }
    }
  };

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Start Date</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>End Date</Text>
          </View>

          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Ledger Name</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Agent Name</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Promise Date</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Total Promise</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>Total Receiving</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{item.s_date}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{item.e_date}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{item.ledger_name}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{item.agent_name}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellText}>{item.s_date}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={[styles.cellText, styles.amountText]}>₹{item.TotalPromiseAmount}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={[styles.cellText, styles.amountText]}>₹{item.TotalReceivingAmount}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Organization Selector */}
      <View style={styles.header}>
        <Text style={styles.label}>Select Organization</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.selectedOrg}>32 --- (PLUS DISTRIBUTION PRIVATE LIMITED-GURUGRAM )</Text>
        </View>
      </View>

      {/* Date Range Selector */}
      <View style={styles.dateContainer}>
        <View style={styles.dateField}>
          <Text style={styles.label}>Select Start Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDate(true)}>
            <Text>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateField}>
          <Text style={styles.label}>Select End Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDate(true)}>
            <Text>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Pickers */}
      {showStartDate && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => onDateChange(event, date, true)}
        />
      )}
      {showEndDate && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => onDateChange(event, date, false)}
        />
      )}

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Promise Amount Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Promised Amount</Text>
            <Text style={styles.summaryValue}>₹{summaryData.totalPromised}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total unauthorized Received</Text>
            <Text style={styles.summaryValue}>₹{summaryData.totalUnauthorized}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Payment Received</Text>
            <Text style={styles.summaryValue}>₹{summaryData.totalPayment}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Outstanding Amount</Text>
            <Text style={styles.summaryValue}>₹{summaryData.outstanding}</Text>
          </View>
        </View>
      </View>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === "All" && styles.activeTab]}
          onPress={() => {
            setCurrentTab("All");
            updateFilteredData(data, "All", selectedAgent, searchText);
          }}
        >
          <Text style={[styles.tabText, currentTab === "All" && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === "Done" && styles.activeTab]}
          onPress={() => {
            setCurrentTab("Done");
            updateFilteredData(data, "Done", selectedAgent, searchText);
          }}
        >
          <Text style={[styles.tabText, currentTab === "Done" && styles.activeTabText]}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, currentTab === "Pending" && styles.activeTab]}
          onPress={() => {
            setCurrentTab("Pending");
            updateFilteredData(data, "Pending", selectedAgent, searchText);
          }}
        >
          <Text style={[styles.tabText, currentTab === "Pending" && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
      </View>

      {/* Agent Filter and Search */}
      <View style={styles.filterContainer}>
        <View style={styles.agentPickerContainer}>
          <Text style={styles.label}>Agent Name</Text>
          <Picker
            selectedValue={selectedAgent}
            style={styles.agentPicker}
            onValueChange={(itemValue) => {
              setSelectedAgent(itemValue);
              updateFilteredData(data, currentTab, itemValue, searchText);
            }}
          >
            {agents.map((agent) => (
              <Picker.Item key={agent} label={agent} value={agent} />
            ))}
          </Picker>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              updateFilteredData(data, currentTab, selectedAgent, text);
            }}
          />
        </View>
      </View>

      {/* Table Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#2874f0" style={styles.loader} />
      ) : (
        <View style={styles.tableContainer}>
          <TableHeader />
          <FlatList
            data={currentData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.table}
            contentContainerStyle={styles.tableContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No data found</Text>
              </View>
            )}
          />
          {/* Pagination Controls */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.paginationText}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  selectedOrg: {
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dateField: {
    flex: 1,
    marginRight: 8,
  },
  dateButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#2874f0",
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  agentPickerContainer: {
    flex: 1,
    marginRight: 8,
  },
  agentPicker: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  searchContainer: {
    flex: 1,
    marginLeft: 8,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    backgroundColor: "#2874f0",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  headerCell: {
    width: 150,
    marginRight: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cell: {
    width: 150,
    marginRight: 16,
  },
  cellText: {
    fontSize: 14,
    color: "#333",
  },
  amountText: {
    color: "#2874f0",
    fontWeight: "600",
  },
  separator: {
    height: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  table: {
    flex: 1,
    marginTop: 50, // Add space for fixed header
  },
  tableContent: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  paginationButton: {
    backgroundColor: "#2874f0",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: "#ccc",
  },
  paginationButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  paginationButtonTextDisabled: {
    color: "#666",
  },
  paginationText: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 16,
  },
});

export default PromiseReportScreen;
