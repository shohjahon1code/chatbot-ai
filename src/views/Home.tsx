import Layout from "./layout";
import Chat from "./Chat";

export default function Home() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
        Antique Expert Chatbot
      </h1>
      <Chat />
    </Layout>
  );
}
