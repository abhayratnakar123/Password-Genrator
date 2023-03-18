// fetch by custome attribute
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthDisplay]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~@#$%^&*()_+}{|"?<>/.,;[]=-';

// Set variables
let password = "";
let passwordLength = 5;
let checkCount = 1;
handleSlider();

// set circle color initially gray


//create function

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + "% 100%"
}

// set indicator color
setIndicator("#ccc");

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}';
}

// get random integer number or symbol --
function getRndInteger(min, max) 
{
// math.random gives you random numbers b/w 0 to 1;
//maths.floor() give you integer if its in decimal
 return   Math.floor(Math.random()*(max - min)) + min; 
}

function generateRandomNumber() {
   return getRndInteger(0,9);
}

function generateLowerCase() {

  return  String.fromCharCode(getRndInteger(97,123));
    
}

function generateUpperCase() {

return String.fromCharCode(getRndInteger(65,91));
    
}

function generateSymbol() {
    const random = getRndInteger(0,symbols.length);
    return symbols.charAt(random);
}

// calculate strength 

function calcStrength() {
    let hasUpper = false;
    let haslower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) haslower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && haslower &&(hasNum || hasSym) && passwordLength >= 8) {

        setIndicator("#0f0");
        
    }
    else if((haslower || hasUpper) &&
    (hasNum&& hasSym)&&
    passwordLength >=6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("f00");
    }
}

//copy content

async function copyContent() {

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";

    }
    catch(e){
        copyMsg.innerText("Error");
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

//shuffal password

function shaffledpassword(array) {
    //fisher yelds methods
    for (let i = array.length -1 ; i >0; i--){
        const j = Math.floor(Math.random()*(i +1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;   
    }
    let str = "";
    array.forEach((el) => (str +=el));
    return str;
}

function handleCheckBoxChange() {

    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if (checkbox.checked) {
            checkCount++;
        }
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//event listner in slider --
inputSlider.addEventListener('input' , (e)=>{
    passwordLength = e.target.value;
    handleSlider();

})
//copy btn
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

//Generate password 
generateBtn.addEventListener('click',(e)=>{
    // ager koi check box tick nhi hai to koi password nhi
    if(checkCount <=0) return;

    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //lets start the journy to find new password

    // remove old password
    password ="";

    // lets put the stuff mentioned by check boxes
     
    //  if(uppercaseCheck.checked){
    //     password += generateUpperCase(); 
    //  }

    //  if(lowercaseCheck.checked){
    //     password += generateLowerCase(); 
    //  }

    //  if(numberCheck.checked){
    //     password += generateRandomNumber(); 
    //  }

    //  if(symbolsCheck.checked){
    //     password += generateSymbol(); 
    //  }

    let funArr = [];

    if(uppercaseCheck.checked){
           funArr.push(generateUpperCase); 
         }
    
         if(lowercaseCheck.checked){
           funArr.push(generateLowerCase); 
         }
    
         if(numberCheck.checked){
           funArr.push(generateRandomNumber); 
         }
    
         if(symbolsCheck.checked){
             funArr.push(generateSymbol); 
         }

         //compulsory addition

         for(let i=0;i<funArr.length; i++){
            password += funArr[i]();
         }
         //remaining additions
         for(let i=0; i< passwordLength-funArr.length;i++){
            let randIndex = getRndInteger(0, funArr.length);
            password += funArr[randIndex]();

         }
         //shaffled password

         password = shaffledpassword(Array.from(password));

         //show it
         passwordDisplay.value = password;
         //claculate strength
         calcStrength();
});