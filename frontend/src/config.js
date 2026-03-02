const config = {
    // Replace this with your App Runner Default Domain after creating the service
    // Example: 'https://xxxx.us-east-1.awsapprunner.com'
    API_BASE_URL: window.location.hostname === 'localhost' ? 'http://127.0.0.1:8000' : 'http://d3w4s9i5smro7f.cloudfront.net',
};

export default config;

// 'http://farmq-1520228141.us-east-1.elb.amazonaws.com'

// const config = {
//   API_BASE_URL: "http://d3w4s9i5smro7f.cloudfront.net",
// //   WS_BASE_URL: "wss://d3w4s9i5smro7f.cloudfront.net",
// };

// export default config;
