const form = document.getElementById('form');
const $messages = document.getElementById('messages');
const message_template = document.getElementById('message-template').innerHTML;

const socket = io();

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the last(new) message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    console.log(newMessageMargin)
    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight >= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('chat', (inputMessage, username) => {
    const result = Mustache.render(message_template, {
        inputMessage,
        username
    });
    $messages.insertAdjacentHTML('beforeend', result);
    autoscroll();
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputMessage = document.getElementById("inputMessage").value;
    socket.emit('chat', inputMessage, "Client")
    form.reset();
})