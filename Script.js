const contractAddress = "0xE4161020C6854D60093E00790b8519C55C06861F" //add deployed address;
const contractABI = [
	
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "productId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "manufacturer",
                    "type": "string"
                }
            ],
            "name": "ProductAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "productId",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "isAuthentic",
                    "type": "bool"
                }
            ],
            "name": "ProductVerified",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "productId",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "manufacturer",
                    "type": "string"
                }
            ],
            "name": "addProduct",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "admin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "index",
                    "type": "uint256"
                }
            ],
            "name": "getProductByIndex",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getProductCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
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
            "name": "productIds",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "name": "products",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "manufacturer",
                    "type": "string"
                },
                {
                    "internalType": "bool",
                    "name": "isAuthentic",
                    "type": "bool"
                },
                {
                    "internalType": "bool",
                    "name": "exists",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "productId",
                    "type": "string"
                }
            ],
            "name": "verifyProduct",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    
];//add abi code;
let web3;
let contract;
let adminAddress;
window.addEventListener("load", async () => {
if (window.ethereum) {
web3 = new Web3(window.ethereum);
await ethereum.request({ method: "eth_requestAccounts" });
contract = new web3.eth.Contract(contractABI, contractAddress);
// Get admin address
adminAddress = await contract.methods.admin().call();
// Load products on initial load
await loadProducts();
} else {
alert("MetaMask is not installed");
}
});
async function addProduct() {
const productId = document.getElementById("productId").value;
const name = document.getElementById("productName").value;
const manufacturer = document.getElementById("manufacturer").value;
const addProductError = document.getElementById("addProductError");
try {
const accounts = await web3.eth.getAccounts();
// Check if current account is admin
if (accounts[0].toLowerCase() !== adminAddress.toLowerCase()) {
addProductError.textContent = "Only admin can add products";
return;
}
// Clear previous error
addProductError.textContent = "";
// Send transaction
await contract.methods.addProduct(productId, name, manufacturer).send({ from:
accounts[0] });
// Refresh product list
await loadProducts();
// Clear input fields
document.getElementById("productId").value = '';
document.getElementById("productName").value = '';
document.getElementById("manufacturer").value = '';
alert("Product added successfully!");
} catch (error) {
addProductError.textContent = error.message;
}
}
async function loadProducts() {
const tableBody = document.getElementById("productTableBody");
tableBody.innerHTML = ''; // Clear existing rows
try {
// Get total number of products
const productCount = await contract.methods.getProductCount().call();
// Iterate through products and add to table
for (let i = 0; i < productCount; i++) {
const productData = await contract.methods.getProductByIndex(i).call();
const row = tableBody.insertRow();
row.insertCell(0).textContent = productData[0]; // Product ID
row.insertCell(1).textContent = productData[1]; // Name
row.insertCell(2).textContent = productData[2]; // Manufacturer
}
} catch (error) {
console.error("Error loading products:", error);
}
}
async function verifyProduct() {
const productId = document.getElementById("verifyProductId").value;
const isAuthentic = await contract.methods.verifyProduct(productId).call();
document.getElementById("verifyResult").innerText = isAuthentic ? "The product is authentic."
: "The product is fake.";
}