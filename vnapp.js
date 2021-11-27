const navToggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".links");

navToggle.addEventListener("click", function () {
    // console.log(links.classList);
    // if(links.classList.contains("show-links")){
    //     links.classList.remove("show-links")
    // }else{
    //     links.classList.add("show-links")
    // }
    links.classList.toggle("show-links");
});


$(document).on('keyup','input[name=info]',function(event){
    this.value = this.value.replace(/[^0-9]/g,'');       
    this.value = this.value.replace(/(^0+)/, "");           
    this.value = this.value.replace(/,/g,'');          
    this.value = this.value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); 	
}); 

const units = document.getElementsByName('currency');
const calBtn = document.getElementById('calc');        
calBtn.addEventListener('click', function (){                                   
    for(i = 0; i < units.length; i++) {
        if(units[i].checked){
        unit = units[i].value;        
        if(unit === 'USD'){
            calcUSD();
        }else{
            calcVND();
        }
        }
    }                    
});

function calcUSD(){
    fetch('https://vnkrtax.com/api/exchange/usd')
        .then(response => response.json())
        .then(data => displayUSD(data))
        .catch((error) => {
            console.error('Error:', error);
        });
}

function displayUSD(exchange){    
    let eur = exchange.rates.EUR;    
    let usd = exchange.rates.USD;
    let vnd = exchange.rates.VND;
    let rate = Math.round(vnd/usd);
    console.log(rate);       
    
    var totalSalary = Number(pit.salary.value.replace(/,/g, ""))*rate + (Math.min(Number(pit.rental.value.replace(/,/g, "")), Number(pit.salary.value.replace(/,/g, "")) *0.15))*rate;
    var insurance = Math.min(Number(pit.salary.value.replace(/,/g, "")) * 0.015*rate, 447000);    
    var deduction = (Number(pit.family.value.replace(/,/g, "")) * 4400000 + 11000000) + insurance;            
    var taxable = totalSalary - deduction;  

    var pitResult = Math.round(calc_pit(taxable)/rate);                              
    var insuranceResult = Math.round(insurance/rate);                
    var incomeResult = Number(pit.salary.value.replace(/,/g, "")) - pitResult - insuranceResult;

    pit.result_pit.value = pitResult.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    pit.result_insurance.value = insuranceResult.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    pit.result_income.value = incomeResult.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");     
}

function calcVND(){
    var basicSalary = Number(pit.basic_salary.value.replace(/,/g, ""));   
    var lunch = Number(pit.lunch.value.replace(/,/g, ""));  
    var overPaidLunch = Math.max(lunch-730000, 0);
    console.log(overPaidLunch);
    var nonInsuranceAllowance = Number(pit.no_insurance_allowance.value.replace(/,/g, "")); 
    var otherAllowance = Number(pit.other_allowance.value.replace(/,/g, ""));
    var incentive = Number(pit.incentive.value.replace(/,/g, ""));
    
    var totalSalary = basicSalary + lunch + nonInsuranceAllowance + otherAllowance + incentive;
    
    var insurance = Math.min((basicSalary + otherAllowance) * 0.105, 3129000);
    var deduction = (Number(pit.family.value.replace(/,/g, "")) * 4400000 + 11000000) + insurance + lunch -overPaidLunch;
    
    var taxable = totalSalary - deduction;        
    console.log(taxable);    
    
    var pitResult = Math.round(calc_pit(taxable));                              
    var insuranceResult = Math.round(insurance);                
    var incomeResult = totalSalary - pitResult - insuranceResult;

    pit.result_gross.value = totalSalary.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    pit.result_pit.value = pitResult.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    pit.result_insurance.value = insuranceResult.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    pit.result_income.value = incomeResult.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");    
};

function calc_pit(a){
    if(a <= 0){
    return 0;
    } else if(a>0 && a <= 5000000){
    return a * 0.05;
    } else if(a > 5000000 && a <= 10000000){
    return ((a-5000000)*0.1 + 250000);
    } else if(a > 10000000 && a <= 18000000){
    return ((a-10000000) * 0.15 + 750000);
    } else if(a> 18000000 && a <= 32000000){
    return ((a-18000000)*0.2 + 1950000);
    } else if(a > 32000000 && a <= 52000000){
    return ((a-32000000)*0.25 + 4750000);
    } else if(a> 52000000 && a <= 80000000){
    return ((a-52000000)*0.3 + 9750000);
    } else{
    return ((a-80000000)*0.35 + 18150000);
    }                
}  