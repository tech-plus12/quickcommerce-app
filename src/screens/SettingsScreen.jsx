import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  DocumentTextIcon,
  TrashIcon,
} from 'react-native-heroicons/outline';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const renderSettingItem = ({ icon: Icon, title, subtitle, value, onValueChange, type = 'toggle' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Icon size={22} color="#2874f0" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#ddd', true: '#2874f0' }}
          thumbColor="#fff"
        />
      ) : (
        <TouchableOpacity onPress={onValueChange}>
          <Text style={styles.actionText}>{value}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        {renderSettingItem({
          icon: BellIcon,
          title: 'Push Notifications',
          subtitle: 'Get notified about orders and offers',
          value: notifications,
          onValueChange: setNotifications,
        })}
        {renderSettingItem({
          icon: GlobeAltIcon,
          title: 'Location Services',
          subtitle: 'Enable location-based features',
          value: locationServices,
          onValueChange: setLocationServices,
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        {renderSettingItem({
          icon: ShieldCheckIcon,
          title: 'Privacy Settings',
          subtitle: 'Manage your data and privacy',
          value: 'Manage',
          onValueChange: () => {},
          type: 'action',
        })}
        {renderSettingItem({
          icon: LockClosedIcon,
          title: 'Change Password',
          subtitle: 'Update your account password',
          value: 'Change',
          onValueChange: () => {},
          type: 'action',
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {renderSettingItem({
          icon: DocumentTextIcon,
          title: 'Terms of Service',
          value: 'View',
          onValueChange: () => {},
          type: 'action',
        })}
        {renderSettingItem({
          icon: DocumentTextIcon,
          title: 'Privacy Policy',
          value: 'View',
          onValueChange: () => {},
          type: 'action',
        })}
      </View>

      <TouchableOpacity style={styles.dangerButton}>
        <TrashIcon size={20} color="#ff4444" />
        <Text style={styles.dangerButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actionText: {
    color: '#2874f0',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
    padding: 16,
  },
  dangerButtonText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;
