import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import axios from '../axios';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const ReportScreen = ({ navigation }) => {
  const [absenceData, setAbsenceData] = useState([]);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    // Make API call to your Laravel route for current month data
    axios.get('/absence-report').then(response => {
      setAbsenceData(response.data);
    });

    // Listen for orientation changes
    const updateOrientation = () => {
      const newScreenWidth = Dimensions.get('window').width;
      setScreenWidth(newScreenWidth);
    };

    Dimensions.addEventListener('change', updateOrientation);

    // Cleanup on unmount
    return () => {
      // Remove the event listener when the component is unmounted
      Dimensions.removeEventListener('change', updateOrientation);
    };
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  // Function to generate a report for each department
  const generateReports = () => {
    return absenceData.map(item => {
      // Generate a report using the data for each department
      return (
        <View key={item.departement}>
          <Text style={styles.departmentTitle}>{item.departement} Rapport</Text>
          <Text>Total des absences : {item.total_absences}</Text>
          {/* Add other report information here */}
        </View>
      );
    });
  };

  return (
    <ScrollView
      horizontal // Enable horizontal scrolling
      style={styles.scrollContainer}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={styles.pageTitle}>Rapport des congés</Text>
          </View>
        </TouchableOpacity>
        
        {/* Center the BarChart and add padding to the top */}
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: absenceData.map(item => item.departement),
              datasets: [
                {
                  data: absenceData.map(item => item.total_absences),
                },
              ],
            }}
            width={screenWidth - 40} // Adjusted width to fit the screen
            height={200}
            yAxisLabel="Absences"
            chartConfig={chartConfig}
          />
        </View>

        {/* Display reports for each department */}
        {generateReports()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20, // Add some padding to the right for a better scrolling experience
  },
  chartContainer: {
    alignItems: 'center', // Center the chart horizontally
    paddingTop: 80, // Add padding to the top
  },
  departmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ReportScreen;
