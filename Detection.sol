// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.14; 
 
contract fakedet { 
    address public admin; 
 
    struct Product { 
        string name; 
        string manufacturer; 
        bool isAuthentic; 
        bool exists; 
    } 
 
    mapping(string => Product) public products; 
    string[] public productIds; 
 
    event ProductAdded(string productId, string name, string manufacturer); 
    event ProductVerified(string productId, bool isAuthentic); 
 
    modifier onlyAdmin() { 
        require(msg.sender == admin, "Only admin can perform this action"); 
        _; 
    } 
 
    constructor() { 
        admin = msg.sender; 
    } 
 
    function addProduct( 
        string memory productId,  
        string memory name,  
        string memory manufacturer 
    ) public onlyAdmin { 
        require(!products[productId].exists, "Product already exists"); 
         
        products[productId] = Product({ 
            name: name,  
            manufacturer: manufacturer,  
            isAuthentic: true, 
            exists: true 
        }); 
         
        productIds.push(productId); 
         
        emit ProductAdded(productId, name, manufacturer); 
    } 
 
    function verifyProduct(string memory productId) public view returns (bool) { 
        return products[productId].isAuthentic; 
    } 
 
    function getProductCount() public view returns (uint) { 
        return productIds.length; 
    } 
 
    function getProductByIndex(uint index) public view returns (string memory, string memory, 
string memory) { 
        require(index < productIds.length, "Invalid index"); 
        string memory productId = productIds[index]; 
        Product memory product = products[productId]; 
        return (productId, product.name, product.manufacturer); 
    } 
} 