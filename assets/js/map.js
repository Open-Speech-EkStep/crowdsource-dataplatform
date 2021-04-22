const statesInformation = [
  { id: 'IN-TG', state: 'Telangana', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AN', state: 'Andaman and Nicobar Islands', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AP', state: 'Andhra Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AR', state: 'Arunanchal Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-AS', state: 'Assam', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-BR', state: 'Bihar', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-CT', state: 'Chhattisgarh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-GA', state: 'Goa', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-GJ', state: 'Gujarat', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-HR', state: 'Haryana', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-HP', state: 'Himachal Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-JK', state: 'Jammu & Kashmir', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-JH', state: 'Jharkhand', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-KA', state: 'Karnataka', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-KL', state: 'Kerala', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-LD', state: 'Lakshadweep', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-MP', state: 'Madhya Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-MH', state: 'Maharashtra', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-MN', state: 'Manipur', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-CH', state: 'Chandigarh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-PY', state: 'Puducherry', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-PB', state: 'Punjab', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-RJ', state: 'Rajasthan', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-SK', state: 'Sikkim', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-TN', state: 'Tamil Nadu', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-TR', state: 'Tripura', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-UP', state: 'Uttar Pradesh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-UT', state: 'Uttarakhand', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-WB', state: 'West Bengal', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-OR', state: 'Odisha', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-DNDD', state: 'Dadra and Nagar Haveli and Daman and Diu', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-ML', state: 'Meghalaya', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-MZ', state: 'Mizoram', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-NL', state: 'Nagaland', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-DL', state: 'National Capital Territory of Delhi', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 },
  { id: 'IN-LK', state: 'Ladakh', contributed_time: "0 hrs", validated_time: "0 hrs", total_speakers: 0 }
]

const generateIndiaMap = function (language="") {
  const url = language !== "" ? '/aggregate-data-count?byState=true&byLanguage=true' : '/aggregate-data-count?byState=true';
  performAPIRequest(url)
    .then((data) => {
      const response = language !== "" ? getLanguageSpecificData(data, language) : data;
      drawMap(response);
    })
    .catch((err) => {
      console.log(err);
    });
};