window.addEventListener('load', async () => {
    // Connecter à Ethereum en utilisant Web3.js
    try {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            throw new Error('Web3 not found. Consider installing MetaMask: https://metamask.io/');
        }

        // Charger le contrat intelligent
        const contractAddress = '0xDc9B89b08e263E771376c2C07A334C7e988B5446'; // Remplacez par l'adresse de votre contrat déployé
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
]; // Ajoutez votre ABI ici
	
	    
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

            try {
                await contract.methods.addMessage(message).send({ from:'0x71Fb00290240b18427aDEaEBDE4f327162D8468c'});
                messageInput.value = '';
                refreshMessageList();
            } catch (error) {
                showError(error.message);
            }
        });
    } catch (error) {
        showError(error.message);
    }
});

function showError(errorMessage) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = `<p style="color: red;">Error: ${errorMessage}</p>`;
}
