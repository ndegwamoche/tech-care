
document.addEventListener('DOMContentLoaded', function () {
  
    document.getElementById("patients-container").style.maxHeight = document.getElementById('diagnosis').offsetHeight+"px";

    document.addEventListener('click', function (event) {
        console.log(event.target)
        if (event.target.matches('#get-patient-data')) {
            const index = event.target.getAttribute('data-index');
            loadData(index);
        }
    });

    //load Jessica Taylor's data by default
    loadData(3);

    function loadData(employee_key) {

        const username = "coalition";
        const password = "skills-test";
        let auth = btoa(`${username}:${password}`);

        // Authenticate (dummy API)
        fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
            headers: {
                'Authorization': `Basic ${auth}`
            }
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw response;
        }).then(function (data) {
            console.log(data);

            
            let patient = data[employee_key];

            //patient data
            document.getElementById('profile_pic').src = patient.profile_picture;
            document.getElementById('name').textContent = patient.name;
            document.getElementById('dob').textContent = formatDate(patient.date_of_birth);
            document.getElementById('gender').textContent = patient.gender;
            document.getElementById('contact-info').textContent = patient.phone_number;
            document.getElementById('emergency-contacts').textContent = patient.emergency_contact;
            document.getElementById('insurance-provider').textContent = patient.insurance_type;

            // Extract latest diagnostic data
            let latestDiagnosis = patient.diagnosis_history[0];
            document.getElementById('respiratory-rate').textContent = `${latestDiagnosis.respiratory_rate.value} bpm`;
            document.getElementById('temperature').textContent = `${latestDiagnosis.temperature.value}°F`;
            document.getElementById('heart-rate').textContent = `${latestDiagnosis.heart_rate.value} bpm`;

            //diagnostic history and lab results
            let diagnosticList = patient.diagnostic_list.map(diagnostic => {
                return `<tr><td>${diagnostic.name}</td><td>${diagnostic.description}</td><td>${diagnostic.status}</td></tr>`;
            }).join('');

            document.getElementById('diagnostic-list').innerHTML = diagnosticList;

            // Update lab results similarly
            let labResults = patient.lab_results.map(result => `<tr><td>${result}</td><td><img src="img/download_FILL0_wght300_GRAD0_opsz24.svg"></td></tr>`).join('');
            document.getElementById('lab-results').innerHTML = labResults;

            if (window.myChart) {
                window.myChart.destroy();
            }

            //update charts
            let months = patient.diagnosis_history.map(history => `${history.month} ${history.year}`);
            let systolicValues = patient.diagnosis_history.map(history => history.blood_pressure.systolic.value);
            let diastolicValues = patient.diagnosis_history.map(history => history.blood_pressure.diastolic.value);

            var ctx = document.getElementById('myAreaChart').getContext('2d');

            window.myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Systolic Blood Pressure',
                            data: systolicValues,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: true
                        },
                        {
                            label: 'Diastolic Blood Pressure',
                            data: diastolicValues,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: true
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });



            // Loop through all patients and add them to the page
            let patientsContainer = document.getElementById('patients-container');
            data.forEach((patient, index) => {
                let patientItem = document.createElement('div');
                patientItem.className = 'patient-item row no-gutters align-items-center p-3 mb-2';
                patientItem.innerHTML = `
                <div class="col-auto logged_in_user_img">
                        <img data-index="${index}" src="${patient.profile_picture}" id='get-patient-data' alt="Patient Image">
                </div>
                <div class="col mr-3">
                    <div class="text-xs mb-1 logged_in_user">
                        <a data-index="${index}" href="javascript:void(0);" id='get-patient-data' style="text-decoration:none;">${patient.name}</a>
                    </div>
                    <div class="h5 mb-0 patients_details">${patient.gender}, ${calculateAge(patient.date_of_birth)}</div>
                </div>
                <div class="col-auto">
                    <img src="img/more_horiz_FILL0_wght300_GRAD0_opsz24.png" alt="More" class="float-right">
                </div>`;
                patientsContainer.appendChild(patientItem);
            });

        }).catch(function (error) {
            console.warn(error);
        });
    }

    //functions
    function formatDate(inputDate) {
        let dateObject;

        // Check if the input date is in 'YYYY-MM-DD' format
        if (inputDate.includes('-')) {
            const [year, month, day] = inputDate.split('-');
            dateObject = new Date(year, month - 1, day);
        }
        // Check if the input date is in 'MM/DD/YYYY' format
        else if (inputDate.includes('/')) {
            const [month, day, year] = inputDate.split('/');
            dateObject = new Date(year, month - 1, day);
        } else {
            // If the date format is unknown, return the input date as is
            return inputDate;
        }

        // Array of month names for formatting
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Format the date in "Month Day, Year" format
        const formattedDate = `${monthNames[dateObject.getMonth()]} ${dateObject.getDate()}, ${dateObject.getFullYear()}`;

        return formattedDate;
    }

    function calculateAge(dob) {
        const dateOfBirth = new Date(dob);
        const diffMs = Date.now() - dateOfBirth.getTime();
        const ageDt = new Date(diffMs);

        return Math.abs(ageDt.getUTCFullYear() - 1970);
    }

    function myFunction(meso) {
        alert(meso);
    }
});
