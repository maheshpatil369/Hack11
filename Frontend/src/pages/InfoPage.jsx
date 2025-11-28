export default function InfoPage() {
  return (
    <div className="flex flex-col p-8 bg-white shadow rounded-lg mx-6 my-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">About SureSignal</h1>

      <p className="text-gray-600 leading-relaxed text-lg">
        SureSignal is an AI-powered fact verification assistant that helps users 
        analyze text, URLs, and content to determine accuracy and detect misinformation.
        <br /><br />
        This demo version supports:
      </p>

      <ul className="list-disc ml-6 mt-3 text-gray-700 text-lg space-y-2">
        <li>Text verification using /api/verify</li>
        <li>URL verification using /api/verify-url</li>
        <li>Dummy file/image upload (local only)</li>
        <li>Chat history saved locally</li>
      </ul>

      <p className="text-gray-600 mt-6 text-lg">
        Use the sidebar to start new chats, search previous conversations, or explore more features.
      </p>
    </div>
  );
}
