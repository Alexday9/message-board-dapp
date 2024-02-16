window.addEventListener('load', async () => {
    // Connecter à Ethereum en utilisant Web3.js
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('Web3 not found. Consider installing MetaMask: https://metamask.io/');
        return;
    }

    // Charger le contrat intelligent
    const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Remplacez par l'adresse de votre contrat déployé
    const contractABI = [ // Remplacez par l'ABI de votre contrat
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_message",
                    "type": "string"
                }
            ],
            "name": "addMessage",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getMessages",
            "outputs": [
                {
                    "name": "",
                    "type": "string[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Récupérer la liste des messages enregistrés
    const messageListElement = document.getElementById('messageList');
    async function refreshMessageList() {
        messageListElement.innerHTML = '';
        const messages = await contract.methods.getMessages().call();
        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            messageListElement.appendChild(messageElement);
        });
    }
    refreshMessageList();

    // Soumettre le formulaire pour ajouter un message
    const messageForm = document.getElementById('messageForm');
    messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value;
        if (message.trim() === '') return;
        await contract.methods.addMessage(message).send({ from: web3.eth.defaultAccount });
        messageInput.value = '';
        refreshMessageList();
    });
});
