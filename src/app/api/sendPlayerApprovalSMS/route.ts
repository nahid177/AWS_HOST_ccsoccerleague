import twilio from 'twilio';

// Initialize Twilio client with environment variables
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Define the parameter types for the sendSMS function
interface SMSParams {
  playerName: string;
  playerPhone: string;
  teamName: string;
  playerId: string;
}

// Function to send SMS
const sendSMS = async ({ playerName, playerPhone, teamName, playerId }: SMSParams) => {
  // Convert the phone number to E.164 format (North America format: +1 and then the phone number)
  const formattedPhoneNumber = `+1${playerPhone.replace(/^0/, '')}`; 

  const message = `Hello ${playerName}, your registration for ${teamName} is confirmed! Your Player ID: ${playerId}. [Your Website Link].`;

  try {
    const sentMessage = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Use Twilio number from environment variables
      to: formattedPhoneNumber,
    });

    console.log('Message sent: ', sentMessage.sid);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

// Define the POST handler with proper types for request and response
export const POST = async (req: Request) => {
  // Parse the request body to get player details
  const { playerName, playerPhone, teamName, playerId }: SMSParams = await req.json(); // type assertion

  try {
    // Send SMS after receiving the request
    await sendSMS({ playerName, playerPhone, teamName, playerId });

    return new Response('SMS sent successfully', { status: 200 });
  } catch (error) {
    console.error('Error in sending SMS:', error);
    return new Response('Failed to send SMS', { status: 500 });
  }
};
