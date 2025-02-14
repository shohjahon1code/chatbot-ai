/** @jsx jsx */
import { jsx } from "hono/jsx";

const Layout = ({ children }: { children: any }) => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Antique Expert Chatbot</title>
      </head>
      <body className="flex w-full justify-center p-24">
        <div className="max-w-2xl w-full">{children}</div>
        <script src="/js/chat.js"></script>
      </body>
    </html>
  );
};

export default Layout;