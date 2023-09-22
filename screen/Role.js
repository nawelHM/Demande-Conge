import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8000'; // Base URL of your local API

const RoleChangePage = () => {
  const [userId, setUserId] = useState('');
  const [newRole, setNewRole] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleChangeRole = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/auth/changeUserRole/${userId}`, { role: newRole });
      setResponseMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setResponseMessage("Une erreur s'est produite lors de la mise à jour du rôle.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{margin:20, color: '#000', textAlign: 'center' ,fontStyle:'bold' }}>Changer le rôle</Text>
      <TextInput
        placeholder="ID de l'utilisateur"
        value={userId}
        onChangeText={setUserId}
        style={{ marginTop: 10, marginBottom: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
      />
      <TextInput
        placeholder="Nouveau rôle"
        value={newRole}
        onChangeText={setNewRole}
        style={{ marginBottom: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
      />
      <TouchableOpacity onPress={handleChangeRole} style={{ backgroundColor: '#151530', padding: 10, borderRadius: 5 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Changer le rôle</Text>
      </TouchableOpacity>
      <Text style={{ marginTop: 10 }}>{responseMessage}</Text>
    </View>
  );
};

export default RoleChangePage;
