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
    const contractAddress = '0xb7bb1792BBfabbA361c46DC5860940e0E1bFb4b'; // Remplacez par l'adresse de votre contrat déployé
    const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			}
		],
		"name": "addMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMessages",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "messages",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
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
