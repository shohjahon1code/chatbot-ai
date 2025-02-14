export default function Chat() {
  return (
    <div className="flex flex-col h-full">
      <div
        id="messages"
        className="flex-1 h-[calc(100vh-200px)] bg-gray-50 rounded-lg overflow-y-auto p-4"
      ></div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <form id="chat-form" className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              id="chat-input"
              placeholder="Ask about antiques..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              id="send-button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex-1">
              <div className="relative">
                <input
                  type="file"
                  id="image-input"
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-full px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <span id="file-name">Upload an image of your antique</span>
                </div>
              </div>
            </label>
            <button
              type="button"
              id="analyze-button"
              disabled
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              Analyze
            </button>
          </div>
        </form>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          const form = document.getElementById('chat-form');
          const input = document.getElementById('chat-input');
          const messagesDiv = document.getElementById('messages');
          const sendButton = document.getElementById('send-button');
          const imageInput = document.getElementById('image-input');
          const fileNameSpan = document.getElementById('file-name');
          const analyzeButton = document.getElementById('analyze-button');
          let isLoading = false;
          let currentImageUrl = null;

          function addMessage(content, isUser, imageUrl = null) {
            const div = document.createElement('div');
            div.className = \`mb-4 p-4 rounded-lg max-w-[80%] \${
              isUser 
                ? 'ml-auto bg-blue-100 text-blue-900'
                : 'mr-auto bg-gray-100 text-gray-900'
            }\`;
            
            if (imageUrl) {
              const img = document.createElement('img');
              img.src = imageUrl;
              img.className = 'max-w-full rounded-lg mb-2';
              div.appendChild(img);
            }
            
            const text = document.createElement('div');
            text.textContent = content;
            div.appendChild(text);
            
            messagesDiv.appendChild(div);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }

          function addLoadingIndicator() {
            const div = document.createElement('div');
            div.className = 'mr-auto mb-4 p-4 rounded-lg bg-gray-100 text-gray-900';
            div.innerHTML = \`
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            \`;
            div.id = 'loading-indicator';
            messagesDiv.appendChild(div);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
          }

          function removeLoadingIndicator() {
            const indicator = document.getElementById('loading-indicator');
            if (indicator) {
              indicator.remove();
            }
          }

          async function handleSubmit(e) {
            e.preventDefault();
            const message = input.value.trim();
            if (!message || isLoading) return;

            isLoading = true;
            sendButton.disabled = true;
            input.value = '';
            
            addMessage(message, true);
            addLoadingIndicator();

            try {
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
              });
              
              const data = await response.json();
              removeLoadingIndicator();
              
              if (data.success) {
                addMessage(data.message, false);
              } else {
                addMessage('Sorry, I encountered an error. Please try again.', false);
              }
            } catch (error) {
              console.error('Chat error:', error);
              removeLoadingIndicator();
              addMessage('Sorry, I encountered an error. Please try again.', false);
            } finally {
              isLoading = false;
              sendButton.disabled = false;
            }
          }

          async function handleImageUpload(file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
              const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
              });

              const data = await response.json();
              if (data.success) {
                currentImageUrl = data.imageUrl;
                analyzeButton.disabled = false;
                return data.imageUrl;
              } else {
                throw new Error(data.error || 'Upload failed');
              }
            } catch (error) {
              console.error('Upload error:', error);
              addMessage('Failed to upload image. Please try again.', false);
              return null;
            }
          }

          async function handleImageAnalysis() {
            if (!currentImageUrl || isLoading) return;

            isLoading = true;
            analyzeButton.disabled = true;
            
            addMessage('Please analyze this antique item:', true, currentImageUrl);
            addLoadingIndicator();

            try {
              const response = await fetch('/api/chat/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: currentImageUrl })
              });
              
              const data = await response.json();
              removeLoadingIndicator();
              
              if (data.success) {
                addMessage(data.message, false);
              } else {
                addMessage('Sorry, I encountered an error analyzing the image. Please try again.', false);
              }
            } catch (error) {
              console.error('Analysis error:', error);
              removeLoadingIndicator();
              addMessage('Sorry, I encountered an error analyzing the image. Please try again.', false);
            } finally {
              isLoading = false;
              analyzeButton.disabled = false;
              // Reset image upload
              currentImageUrl = null;
              fileNameSpan.textContent = 'Upload an image of your antique';
              analyzeButton.disabled = true;
              imageInput.value = '';
            }
          }

          // Event Listeners
          form.addEventListener('submit', handleSubmit);
          
          imageInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
              fileNameSpan.textContent = file.name;
              await handleImageUpload(file);
            }
          });

          analyzeButton.addEventListener('click', handleImageAnalysis);
        `,
        }}
      />
    </div>
  );
}
