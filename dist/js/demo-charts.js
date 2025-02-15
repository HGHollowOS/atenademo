document.addEventListener("DOMContentLoaded", function () {
  // Function to get the full week of day names
  function getDaysOfWeek() {
    // Returns the full week, starting from Monday
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }

  // Modified to generate mock data for days up to today and empty for the rest
  function generateMockDataForWeek() {
    const today = new Date().getDay(); // Sunday - 0, Monday - 1, etc.
    let data = [];
    for (let i = 1; i <= 7; i++) { // Loop through a full week, starting with Monday (1) to Sunday (7)
      if (i < today || (today === 0 && i < 7)) {
        // Generate mock data for days up to today, adjust for Sunday being the end of the array
        data.push(Math.floor(Math.random() * 10) + 1);
      } else if (today === 0 && i === 7) {
        // Special case for when today is Sunday
        data.push(Math.floor(Math.random() * 10) + 1);
      } else {
        // Use null for days after today to show them as empty
        data.push(null);
      }
    }
    // No need to shift Sunday to the end because we are accounting for it in the loop
    return data;
  }

  window.ApexCharts && (new ApexCharts(document.getElementById('chartAlertsTrend'), {
    chart: {
      type: "bar",
      fontFamily: 'inherit',
      height: 240,
      animations: {
        enabled: true
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    series: [{
      name: "High Alert",
      data: generateMockDataForWeek()
    }, {
      name: "Medium Alert",
      data: generateMockDataForWeek()
    }, {
      name: "Low Alert",
      data: generateMockDataForWeek()
    }],
    xaxis: {
      categories: getDaysOfWeek(),
    },
    tooltip: {
      theme: 'dark'
    },
    fill: {
      opacity: 1
    },
    colors: ["#d63939", "#f7b924", "#45aaf2"],
  })).render();
});



document.addEventListener("DOMContentLoaded", function () {
  function generate24HourTimestamps() {
    const timestamps = [];
    const now = new Date();
    now.setMinutes(0, 0, 0); // Round down to the nearest hour

    // Generate timestamps for the last 24 hours
    for (let i = -23; i <= 0; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
      timestamps.push(hour.toISOString());
    }

    return timestamps;
  }

  // Fixed data for the last 24 hours
  const fixedData = [
    0, 135, 150, 0, 0, 0, 0, 0,
    0, 0, 65, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 120, 154, 0, null // Last element is null for the current incomplete hour
  ];

  function createOrUpdateChart() {
    const categories = generate24HourTimestamps();

    if (window.chart) {
      // If the chart already exists, update it
      window.chart.updateOptions({
        xaxis: {
          categories: categories,
        },
        series: [{
          data: fixedData,
        }]
      });
    } else {
      // If the chart doesn't exist, create it
      window.chart = new ApexCharts(document.getElementById('chartResponseTime'), {
        chart: {
          type: "line",
          fontFamily: 'inherit',
          height: 240,
          animations: {
            enabled: true
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 3,
          curve: "smooth",
        },
        series: [{
          name: "Response Time",
          data: fixedData
        }],
        grid: {
          strokeDashArray: 4,
        },
        xaxis: {
          type: 'datetime',
          categories: categories,
        },
        tooltip: {
          theme: 'dark'
        },
        colors: ["#206bc4"],
      }).render();
    }
  }

  // Initial chart creation or update
  createOrUpdateChart();

  // Update the chart every hour to reflect new time range
  setInterval(createOrUpdateChart, 3600000); // 3600000 milliseconds in an hour
});






function updateChartConv(sensorId) {
  let data = [];
  let name = '';
  let chartType = 'line'; // Default chart type

  // Example: Hourly data for a single day
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  switch (sensorId) {
    case 'sensor1':
      data = Array.from({ length: 24 }, () => Math.round(Math.random() * 10 + 5) / 100);
      name = 'Vibration Data';
      chartType = 'line';
      break;
    case 'sensor2':
      data = Array.from({ length: 24 }, () => Math.round(Math.random() * 5 + 20) / 100);
      name = 'Speed Data';
      chartType = 'line';
      break;
    case 'sensor3':
      data = Array.from({ length: 24 }, () => Math.round(Math.random() * 10 + 30) / 100);
      name = 'Infrared Thermo Data';
      chartType = 'area';
      break;
    case 'sensor4':
      data = Array.from({ length: 24 }, () => Math.round(Math.random() * 5 + 40) / 100);
      name = 'Inductive Prox Data';
      chartType = 'bar';
      break;
    // Additional sensors as needed
  }

  var options = {
    chart: {
      type: chartType,
      height: 350,
    },
    series: [{
      name: name,
      data: data
    }],
    xaxis: {
      categories: hours,
      title: {
        text: 'Time of Day',
      }
    },
    yaxis: {
      title: {
        text: name,
      }
    },
    colors: ['#FF4560'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
  };

  // Check if the chart has already been initialized
  if (window.currentChart) {
    window.currentChart.destroy();
  }

  // Render the new chart
  window.currentChart = new ApexCharts(document.querySelector("#commonChartConv"), options);
  window.currentChart.render();
}

function updateChartArm(sensorType) {
  let chartData = getSensorDataArm(sensorType);
  let options = {
    chart: {
      type: 'line', // Customize based on data type
      height: 350,
    },
    series: [{
      name: chartData.name,
      data: chartData.data
    }],
    xaxis: {
      categories: chartData.categories,
      title: {
        text: 'Time'
      }
    },
    yaxis: {
      title: {
        text: chartData.yAxisTitle
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    colors: [chartData.color],
  };

  // Render or update the chart with new data
  if (window.currentChartArm) {
    window.currentChartArm.destroy();
  }
  window.currentChartArm = new ApexCharts(document.querySelector("#commonChartArm"), options);
  window.currentChartArm.render();
}

// Function to simulate getting data for the robot arm's sensors
function getSensorDataArm(sensorType) {
  // Simulation: Replace this with real data retrieval
  const categories = ['00:00', '01:00', '02:00', '...']; // Hourly intervals, for example
  const data = categories.map(() => Math.floor(Math.random() * 100));

  switch (sensorType) {
    case 'precision':
      return { name: 'Precision', data, categories, yAxisTitle: 'Precision Measure', color: '#008FFB' };
    case 'repeatability':
      return { name: 'Repeatability', data, categories, yAxisTitle: 'Repeatability Score', color: '#00E396' };
    case 'operationalStatus':
      return { name: 'Operational Status', data, categories, yAxisTitle: 'Status Indicator', color: '#775DD0' };
    case 'temperature':
      return { name: 'Temperature', data, categories, yAxisTitle: 'Temperature (°C)', color: '#FF4560' };
    default:
      return { name: 'Data', data: [], categories: [], yAxisTitle: 'Value', color: '#546E7A' };
  }
}


// Assuming ApexCharts is used for chart rendering
function updateChartHydr(sensorType) {
  let chartData = getSensorData(sensorType);
  let options = {
    chart: {
      type: 'line', // Default chart type, can be adjusted per sensor if needed
      height: 350,
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      }
    },
    series: [{
      name: chartData.name,
      data: chartData.data
    }],
    xaxis: {
      categories: chartData.categories,
      title: {
        text: 'Time'
      }
    },
    yaxis: {
      title: {
        text: chartData.yAxisTitle
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    colors: [chartData.color],
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    },
  };

  var chartElement = document.querySelector("#commonChartHydr");
  if (window.currentChart) {
    window.currentChart.destroy();
  }
  window.currentChart = new ApexCharts(chartElement, options);
  window.currentChart.render();
}

// Simulated sensor data function
function getSensorData(sensorType) {
  // You would replace these with actual data retrieval logic
  let now = new Date(), categories = [], data = [];
  for (let i = 23; i >= 0; i--) {
    let hour = new Date(now.getTime() - i * 3600 * 1000);
    categories.push(`${hour.getHours()}:00`);
    data.push(Math.round(Math.random() * 100));
  }

  switch (sensorType) {
    case 'pressure':
      return { name: 'Pressure', data: data, categories: categories, yAxisTitle: 'Pressure (psi)', color: '#008FFB' };
    case 'temperature':
      return { name: 'Temperature', data: data, categories: categories, yAxisTitle: 'Temperature (°C)', color: '#FF4560' };
    case 'flow':
      return { name: 'Flow Rate', data: data, categories: categories, yAxisTitle: 'Flow Rate (L/min)', color: '#00E396' };
    case 'level':
      return { name: 'Fluid Level', data: data, categories: categories, yAxisTitle: 'Level (%)', color: '#775DD0' };
    default:
      return { name: 'Data', data: [], categories: categories, yAxisTitle: 'Value', color: '#546E7A' };
  }
}


function updateChartPump(sensorType) {
  let chartData = getSensorData(sensorType);
  let options = {
    chart: {
      type: 'line', // Default, can be customized per sensor
      height: 350,
      animations: {
        enabled: true,
      },
      toolbar: {
        show: false
      }
    },
    series: [{
      name: chartData.name,
      data: chartData.data
    }],
    xaxis: {
      categories: chartData.categories,
      title: {
        text: 'Time'
      }
    },
    yaxis: {
      title: {
        text: chartData.yAxisTitle
      }
    },
    colors: [chartData.color],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
  };

  // Handling for offline status and critical alerts
  if (sensorType === 'offlineStatus') {
    options.chart.type = 'area'; // Example adjustment
    // Adjust options or display message accordingly
  }

  var chartElement = document.querySelector("#commonChartPump");
  if (window.currentChart) {
    window.currentChart.destroy();
  }
  window.currentChart = new ApexCharts(chartElement, options);
  window.currentChart.render();
}


// Extend the fetchKPIData function with more mock data
function fetchKPIData() {
  // Return a Promise with mock data simulating a backend response
  return Promise.resolve([
    {
      name: 'MTBF',
      period: 'Last 7 Days',
      value: '250',
      unit: 'Hours',
      progressBarColor: 'bg-success',
      progress: 98,
      changeIndicatorClass: 'text-success',
      changePercentage: '10% Improvement'
    },
    {
      name: 'MTTR',
      period: 'Last 7 Days',
      value: '1.5',
      unit: 'Hours',
      progressBarColor: 'bg-danger',
      progress: 90,
      changeIndicatorClass: 'text-danger',
      changePercentage: '20% Reduction'
    },
    {
      name: 'Alerts',
      period: 'Last 30 Days',
      value: '6782',
      unit: '',
      progressBarColor: 'bg-warning',
      progress: 60,
      changeIndicatorClass: 'text-warning',
      changePercentage: '5% Increase'
    },
    {
      name: 'MTTA',
      period: 'Last 30 Days',
      value: '30',
      unit: 'Minutes',
      progressBarColor: 'bg-success',
      progress: 75,
      changeIndicatorClass: 'text-success',
      changePercentage: '15% Improvement'
    },
    {
      name: 'Operational Efficiency',
      period: 'Current Month',
      value: '92',
      unit: '%',
      progressBarColor: 'bg-info',
      progress: 92,
      changeIndicatorClass: 'text-info',
      changePercentage: 'Stable'
    },
    {
      name: 'Downtime',
      period: 'Current Month',
      value: '2',
      unit: 'Hours',
      progressBarColor: 'bg-danger',
      progress: 5,
      changeIndicatorClass: 'text-danger',
      changePercentage: '50% Reduction'
    }
  ]);
}

fetchKPIData().then(data => {
  const gridContainer = document.getElementById('kpiCardsContainer');
  gridContainer.innerHTML = ''; // Clear previous content

  data.forEach(kpi => {
    const cardHTML = `
      <div class="col-md-4 mb-4">
        <div class="card kpi-card" style="background-color: var(--tblr-white-bg); color: var(--tblr-black-color); border-color: var(--tblr-border-color);">
          <div class="card-body">
            <h5 class="subheader" style="color: var(--tblr-emphasis-color);">${kpi.name}</h5>
            <p class="text-muted" style="color: var(--tblr-tertiary-color);">${kpi.period}</p>
            <h2 class="mb-3" style="color: var(--tblr-emphasis-color);">${kpi.value} ${kpi.unit}</h2>
            <div class="progress progress-sm">
              <div class="progress-bar ${kpi.progressBarColor}" style="width: ${kpi.progress}%" role="progressbar" aria-valuenow="${kpi.progress}" aria-valuemin="0" aria-valuemax="100">
                <span class="visually-hidden">${kpi.progress}% Complete</span>
              </div>
            </div>
            <small class="${kpi.changeIndicatorClass} mt-2" style="color: var(--tblr-emphasis-color);">${kpi.changePercentage}</small>
          </div>
        </div>
      </div>
    `;

    gridContainer.innerHTML += cardHTML; // Append the card to the grid container
  });
});

// Example function to fetch system status indicators
function fetchSystemStatus() {
  // Placeholder for fetching system status from backend
  return Promise.resolve([
    { name: 'Conveyor Belt', status: 'Good', statusClass: 'bg-success' },
    { name: 'Hydraulic Press', status: 'Attention', statusClass: 'bg-warning' },
    { name: 'Pump Station', status: 'Critical', statusClass: 'bg-danger' }
    // Add more systems as necessary
  ]);
}

document.addEventListener('DOMContentLoaded', function () {
  // Your chart initialization code here

  function displaySystemStatus() {
    // Simulating fetching data - in a real scenario, this would be an asynchronous fetch from a backend
    const data = [
      { id: 'EQ-001', type: 'Conveyor Belt', status: 'Good', statusClass: 'bg-success', lastMaintenance: 'Feb 20, 2024', nextMaintenance: 'May 15, 2024', alerts: 2 },
      { id: 'EQ-002', type: 'Hydraulic Press', status: 'Attention', statusClass: 'bg-warning', lastMaintenance: 'Mar 05, 2024', nextMaintenance: 'Jun 01, 2024', alerts: 1 },
      { id: 'EQ-003', type: 'Pump Station', status: 'Critical', statusClass: 'bg-danger', lastMaintenance: 'Jan 10, 2024', nextMaintenance: 'Jul 20, 2024', alerts: 3 },
      { id: 'EQ-004', type: 'Assembly Robot Arm', status: 'Good', statusClass: 'bg-success', lastMaintenance: 'Mar 9, 2024', nextMaintenance: 'Jul 30, 2024', alerts: 0 },
      { id: 'EQ-005', type: 'Cooling System', status: 'Critical', statusClass: 'bg-danger', lastMaintenance: 'Dec 19, 2023', nextMaintenance: 'Mar 06, 2024', alerts: 4 },
      // Add more equipment details as necessary
    ];

    // Aggregate systems by status
    const statusCounts = data.reduce((acc, system) => {
      acc[system.status] = (acc[system.status] || 0) + 1;
      return acc;
    }, {});

    // Generate HTML for each status
    const indicatorsContainer = document.getElementById('systemStatusIndicators');
    indicatorsContainer.innerHTML = ''; // Clear existing indicators

    Object.keys(statusCounts).forEach(status => {
      const statusClass = status === 'Good' ? 'status-green'
        : status === 'Attention' ? 'status-orange'
          : 'status-red'; // Adjust the color classes as needed
      const animatedClass = 'status-indicator-animated'; // Only if you want animation for all statuses

      const indicatorHTML = `
      <div class="col-md-4 mb-3">
        <div class="d-flex align-items-center">
          <span class="status-indicator ${statusClass} ${animatedClass} me-2">
            <span class="status-indicator-circle"></span>
            <span class="status-indicator-circle"></span>
            <span class="status-indicator-circle"></span>
          </span>
          <div>${status}: ${statusCounts[status]} Machines</div>
        </div>
      </div>
    `;
      indicatorsContainer.innerHTML += indicatorHTML;
    });
  }

});

function fetchAndDisplaySystemHealthDetails() {
  // Placeholder for fetching detailed system health from backend
  const data = [
    { id: 'EQ-001', type: 'Conveyor Belt', status: 'Good', statusClass: 'bg-success', lastMaintenance: 'Feb 20, 2024', nextMaintenance: 'May 15, 2024', alerts: 2 },
    { id: 'EQ-002', type: 'Hydraulic Press', status: 'Attention', statusClass: 'bg-warning', lastMaintenance: 'Mar 05, 2024', nextMaintenance: 'Jun 01, 2024', alerts: 1 },
    { id: 'EQ-003', type: 'Pump Station', status: 'Critical', statusClass: 'bg-danger', lastMaintenance: 'Jan 10, 2024', nextMaintenance: 'Jul 20, 2024', alerts: 3 },
    { id: 'EQ-004', type: 'Assembly Robot Arm', status: 'Good', statusClass: 'bg-success', lastMaintenance: 'Mar 9, 2024', nextMaintenance: 'Jul 30, 2024', alerts: 0 },
    { id: 'EQ-005', type: 'Cooling System', status: 'Critical', statusClass: 'bg-danger', lastMaintenance: 'Dec 19, 2023', nextMaintenance: 'Mar 06, 2024', alerts: 4 },
    // Add more equipment details as necessary
  ];

  const tableContainer = document.getElementById('systemHealthTable');
  let tableHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Equipment ID</th>
          <th>Type</th>
          <th>Status</th>
          <th>Last Maintenance</th>
          <th>Next Scheduled Maintenance</th>
          <th>Active Alerts</th>
        </tr>
      </thead>
      <tbody>
  `;

  data.forEach(item => {
    tableHTML += `
      <tr>
        <td>${item.id}</td>
        <td>${item.type}</td>
        <td><span class="badge ${item.statusClass}">${item.status}</span></td>
        <td>${item.lastMaintenance}</td>
        <td>${item.nextMaintenance}</td>
        <td>${item.alerts}</td>
      </tr>
    `;
  });

  tableHTML += '</tbody></table>';
  tableContainer.innerHTML = tableHTML;
}

// Call the functions to populate the data
displaySystemStatus();
fetchAndDisplaySystemHealthDetails();

document.addEventListener("DOMContentLoaded", function () {
  populateMachineSelector();
  document.getElementById('machineSelector').addEventListener('change', updateSensorOverview);
});

// Populates the machine selection dropdown with available machines
function populateMachineSelector() {
  const machineSelector = document.getElementById('machineSelector');
  const machines = [
    { id: "EQ-001", name: "Conveyor Belt" },
    { id: "EQ-002", name: "Hydraulic Press" },
    { id: "EQ-003", name: "Pump Station" },
    { id: "EQ-004", name: "Assembly Robot Arm" },
    { id: "EQ-005", name: "Cooling System" },
    // Extend this list based on available machines
  ];

  machines.forEach(machine => {
    let option = new Option(`${machine.id} - ${machine.name}`, machine.id);
    machineSelector.add(option);
  });
}

// Updates the sensor overview based on the selected machine
function updateSensorOverview() {
  const selectedMachineId = document.getElementById('machineSelector').value;
  const sensorKpiOverview = document.getElementById('sensorKpiOverview');
  sensorKpiOverview.innerHTML = ''; // Clear previous content

  if (!selectedMachineId) {
    return; // Exit if 'Select a Machine' is chosen
  }

  // Fetch sensor data for the selected machine
  const sensors = fetchSensorsForMachine(selectedMachineId);

  sensors.forEach(sensor => {
    const cardHTML = `
      <div class="col-sm-6 col-lg-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${sensor.name}</h5>
            <p>Status: <span class="${sensor.statusClass}">${sensor.status}</span></p>
            <p>Last Reading: <b>${sensor.lastReading}</b></p>
            <p>Alerts: ${sensor.alertCount}</p>
          </div>
        </div>
      </div>
    `;
    sensorKpiOverview.innerHTML += cardHTML;
  });
}

// Fetches sensor data for a given machine; to be replaced with an actual API call
function fetchSensorsForMachine(machineId) {
  // Placeholder data for demonstration; ideally, replace with a call to your backend
  const exampleSensors = {
    "EQ-001": [
      { name: 'Temperature Sensor', status: 'Good', statusClass: 'text-success', lastReading: '22°C', alertCount: 1 },
      { name: 'Vibration Sensor', status: 'Attention', statusClass: 'text-warning', lastReading: '0.03g', alertCount: 1 },
      { name: 'Humidity Sensor', status: 'Good', statusClass: 'text-success', lastReading: '45%', alertCount: 0 },
      { name: 'Speed Sensor', status: 'Good', statusClass: 'text-success', lastReading: '1500 rpm', alertCount: 0 },
    ],
    "EQ-002": [
      { name: 'Temperature Sensor', status: 'Good', statusClass: 'text-success', lastReading: '30°C', alertCount: 0 },
      { name: 'Oil Level Sensor', status: 'Good', statusClass: 'text-success', lastReading: '75%', alertCount: 0 },
      { name: 'Hydraulic Fluid Sensor', status: 'Good', statusClass: 'text-success', lastReading: 'Optimal', alertCount: 0 },
      { name: 'Pressure Sensor', status: 'Critical', statusClass: 'text-danger', lastReading: '110 kPa', alertCount: 1 },
    ],
    "EQ-003": [
      { name: 'Pressure Sensor', status: 'Good', statusClass: 'text-success', lastReading: '110 kPa', alertCount: 0 },
      { name: 'Flow Rate Sensor', status: 'Good', statusClass: 'text-success', lastReading: '450 L/min', alertCount: 1 },
      { name: 'Water Level Sensor', status: 'Critical', statusClass: 'text-danger', lastReading: 'Low', alertCount: 1 },
      { name: 'Leak Detection Sensor', status: 'Critical', statusClass: 'text-danger', lastReading: 'Detected', alertCount: 1 },
    ],
    "EQ-004": [
      { name: 'Torque Sensor', status: 'Good', statusClass: 'text-success', lastReading: '100 Nm', alertCount: 0 },
      { name: 'Efficiency Sensor', status: 'Good', statusClass: 'text-success', lastReading: '95%', alertCount: 0 },
      { name: 'Wear Sensor', status: 'Good', statusClass: 'text-success', lastReading: 'Aligned', alertCount: 0 },
      { name: 'Position Sensor', status: 'Good', statusClass: 'text-success', lastReading: 'Aligned', alertCount: 0 },
    ],
    "EQ-005": [
      { name: 'Flow Rate Sensor', status: 'Good', statusClass: 'text-success', lastReading: '750 L/min', alertCount: 0 },
      { name: 'Pressure Sensor', status: 'Good', statusClass: 'text-success', lastReading: 'Normal', alertCount: 0 },
      { name: 'Coolant Temperature Sensor', status: 'Critical', statusClass: 'text-danger', lastReading: 'Overheated', alertCount: 2 },
      { name: 'Coolant Level Sensor', status: 'Critical', statusClass: 'text-danger', lastReading: 'Very Low', alertCount: 2 },
    ]
  };

  return exampleSensors[machineId] || [];
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the Pie Chart for Sensor Status Distribution
  const sensorStatusDistributionData = {
    labels: ['Good', 'Needs Attention', 'Critical'],
    datasets: [{
      data: [60, 30, 10], // Example distribution
      backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(255, 99, 132, 0.2)'],
      borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)'],
      borderWidth: 1
    }]
  };

  const sensorStatusDistributionOptions = {
    type: 'pie',
    data: sensorStatusDistributionData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Overall Sensor Status Distribution'
        }
      }
    },
  };

  new Chart(document.getElementById('sensorStatusDistributionChart'), sensorStatusDistributionOptions);

  // Initialize the Line Chart for Alerts Trend
  let alertsDataLastMonth = [];
  for (let day = 1; day <= 30; day++) {
    // Simulating alerts data
    let alerts = Math.floor(Math.random() * 6) + 5;
    if ((day >= 1 && day <= 7) || (day >= 15 && day <= 21)) {
      alerts += Math.floor(Math.random() * 200) + 300;
    }
    alertsDataLastMonth.push(alerts);
  }

  const alertsTrendOptions = {
    type: 'line',
    data: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      datasets: [{
        label: 'Daily Alerts',
        data: alertsDataLastMonth,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Daily Alert Trends Over The Last 30 Days'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Alerts'
          }
        }
      }
    },
  };

  new Chart(document.getElementById('alertsTrendAnalysisChart'), alertsTrendOptions);
});

document.getElementById('reconnectingOverlay5').addEventListener('click', function () {
  var collapseElement = document.getElementById('assetDetailCollapse5');
  var bsCollapse = new bootstrap.Collapse(collapseElement, {
    toggle: true
  });
});