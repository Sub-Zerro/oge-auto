const express = require('express')
const app = express();
const fs = require('fs');
const path = require('path');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const { send } = require('process');

const puppeteer = require('puppeteer');

let img = path.join(__dirname, '/fullpage.png');



//let url = 'https://inf-oge.sdamgia.ru/test?id=20244699&nt=True&pub=False';

app.use(express.json());
app.use(express.urlencoded());

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
})


app.post('/', async function(req, res){
    console.log(req.body);
    await main(req.body.url_adress, req.body.is_auth);
    res.send({});
})

app.use(express.static(path.join(__dirname)));



const PORT = process.env.PORT;
app.listen(PORT || 3000);






























async function main(url, is_auth){
    

    //const browser = await puppeteer.launch({headless: false})

    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'] 
    });

    const page = await browser.newPage()
    await page.goto(url)
    //await page.waitForSelector('body > div.wrapper > div.sgia-main-content > div:nth-child(27) > input[type=button]');
    await page.waitForSelector('input');

    // let course_arr;
    // let syrio_arr;

    let arr = await page.evaluate(async(is_auth)=>{

        async function auth(){
            function clicker(btn){
                btn.click();
                return;
            }

            let auth_a = document.querySelector('body > div.wrapper > div.sgia-main-content > center:nth-child(7) > b > a');
            await clicker(auth_a);
            let login = document.querySelector('#ui-id-1 > input:nth-child(3)');
            let pass = document.querySelector('#ui-id-1 > input:nth-child(4)');
            let btn = document.querySelector('#ui-id-1 > input:nth-child(13)');
        
            login.value = await 'jimi4kuryki@gmail.com';
            pass.value = await '85iz100';
        
            await clicker(btn);
            return;
        }

        if (is_auth == true){
            auth();
        }
    
        
        
        return 1
    }, is_auth)


    

    setTimeout(async() => {
        await page.goto(url)
        let arr2 = await page.evaluate(async()=>{
            function get_questions(){
                let links =  document.querySelectorAll('.prob_nums');
                let arr2 = [];
                for (let i = 0; i < links.length; i++){
                    arr2.push(links[i].innerText);
                }
                console.log(arr2);
                return arr2;
            }

            let nums = get_questions();

            for (let i = 0; i < nums.length; i++){
                for (let k = 0; k < nums[i].length; k++){
                    if (nums[i][k] != 'n'){
                        nums[i] = nums[i].slice(1);
                    }
                }
            }

            for (let i = 0; i < nums.length; i++){
                for (let k = 0; k < 2; k++){
                        nums[i] = nums[i].slice(1);
                }
            }

            let str;
            let arr = [];
            let chisla = '1234567890';

            for (let i = 0; i < nums.length; i++){
                str = '';
                for (let k = 0; k < nums[i].length; k++){
                    for (let n = 0; n < chisla.length; n++){
                        if (nums[i][k] == chisla[n]){
                            str+=chisla[n];
                        }
                    }
                }
                arr.push(str);
            }
            
            console.log(arr);

            return arr;
        })

        console.log(arr2);

        
        let answers_dirt = [];

        for (let i = 0; i < arr2.length; i++){
            await page.goto(`https://inf-oge.sdamgia.ru/problem?id=${arr2[i]}`);
            let arr3 = await page.evaluate(async()=>{
                let answers_arr = [];
                try{
                    let temp = [];
                    for (let k = 0; k < document.body.querySelectorAll('p').length; k++){
                        temp.push(document.body.querySelectorAll('p')[k].innerText);
                    }
                    answers_arr.push(temp);
                    //return document.body.querySelectorAll('p')[document.body.querySelectorAll('p').length-1].innerText;
                    // if (document.body.querySelectorAll('p')[document.body.querySelectorAll('p').length-1].innerText == '' || document.body.querySelectorAll('p')[document.body.querySelectorAll('p').length-1].innerText.length >31){
                    //     return document.body.querySelectorAll('p')[document.body.querySelectorAll('p').length-4].innerText;
                    //     let tem
                    // }else{
                    //     return document.body.querySelectorAll('p')[document.body.querySelectorAll('p').length-3].innerText;
                    // }
                    return answers_arr;
                }catch{
                    return 1;
                }
                
            })
            answers_dirt.push(arr3);
        }

        console.log(answers_dirt, 993);

        let answers_middle = [];

        for (let i = 0; i < answers_dirt.length; i++){
            for (let k = 0; k < answers_dirt[i].length; k++){
                let roma = 0;
                let o = 0;
                let normal = false;
                for (let l = 0; l < answers_dirt[i][k].length; l++){
                    if (o==0){
                        if (answers_dirt[i][k][l][0] == 'О' && answers_dirt[i][k][l][1] == 'т' && answers_dirt[i][k][l][2] == 'в'){
                            answers_middle.push(answers_dirt[i][k][l]);
                            roma++;
                            o++;
                            normal = true;
                            
                            //console.log(answers_dirt[i][k], 1000);
                        }
                    }
                    
                    
                }
                if (roma==0){
                    let c = 0;
                    for (let l = 0; l < answers_dirt[i][k].length; l++){
                        if (answers_dirt[i][k][l][0] == 'С'){

                            if (c==0){
                                c++;
                                answers_middle.push(answers_dirt[i][k][l]);
                                normal = true;
                            }
                            
                            //console.log(answers_dirt[i][k], 1000);
                        }
                    }
                }

                if (normal == false){
                    answers_middle.push('не в этот раз(');
                }
                
                //console.log(answers_dirt[i][k][0]);
            }
        }

        console.log(answers_middle);

        for (let i = 0; i < answers_middle.length; i++){
            if (answers_middle[i][0]=='О'){
                answers_middle[i] = answers_middle[i].slice(6, (answers_middle[i].length-1));
            }
        }

        for (let i = 0; i < answers_middle.length; i++){
            for (let k = 0; k < answers_middle[i].length; k++){
                answers_middle[i] = answers_middle[i].replace(' ', '');
            }
        }

        // while(answers_middle[0][0] != ':'){
        //     answers_middle[0][0] = answers_middle[0][0].slice(1);
        // }

        console.log(answers_middle);
        let alfavit = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

        let angl_alf =  "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        let answers_final = [];
        let str = '';
        for (let i = 0; i < answers_middle.length; i++){
            str = '';
            for (let k = 0; k < answers_middle[i].length; k++){
                if (answers_middle[i][k] != "­"){
                    str+=answers_middle[i][k];
                }
            }
            console.log("str:", str);
            answers_final.push(str);
        }

        console.log(answers_final);

        for (let i = 0; i < answers_final.length; i++){
            

            function check_if_alf(alf){
                let c = 0;

                for (let k = 0; k < alf.length; k++){
                    if (answers_final[i][answers_final[i].length-1] == alf[k]){
                        c++;
                    }
                }
                for (let k = 0; k < alf.length; k++){
                    if (answers_final[i][answers_final[i].length-2] == alf[k]){
                        c++;
                    }
                }
    
                for (let k = 0; k < alf.length; k++){
                    if (answers_final[i][answers_final[i].length-3] == alf[k]){
                        c++;
                    }
                }
                for (let k = 0; k < alf.length; k++){
                    if (answers_final[i][answers_final[i].length-4] == alf[k]){
                        c++;
                    }
                }

                return c;
            }

            let c = await check_if_alf(alfavit);
            if (c==0){
                c = await check_if_alf(angl_alf);
            }

            console.log('C = ', c);

            if (c>=2){
                let temp_str = '';
                let do_chage = false;
                for (let k = 0; k < answers_final[i].length; k++){
                    if (answers_final[i][0]=='С' && (answers_final[i][1]!=answers_final[i][1].toLocaleUpperCase())){

                        if (k>1){
                            for (let n = 0; n < alfavit.length; n++){
                                if (answers_final[i][k] == alfavit[n]){
                                    temp_str+=alfavit[n];
                                    do_chage = true;
                                }
                            }
                            for (let n = 0; n < angl_alf.length; n++){
                                if (answers_final[i][k] == angl_alf[n]){
                                    temp_str+=angl_alf[n];
                                    do_chage = true;
                                }
                            }
                        }
                        
                    }else{
                        if (answers_final[i] != answers_final[i].toLocaleUpperCase()){
                            if (k == (answers_final[i].length-8)){
                                for (let n = 0; n < alfavit.length; n++){
                                    if (answers_final[i][k] == alfavit[n]){
                                        do_chage = true;
                                        temp_str+=alfavit[n];
                                    }
                                }
                                for (let n = 0; n < angl_alf.length; n++){
                                    if (answers_final[i][k] == angl_alf[n]){
                                        temp_str+=angl_alf[n];
                                        do_chage = true;
                                    }
                                }
                            }
                        }
                        
                    }
                }
                console.log('Ура!!!!!!', temp_str);
                if (do_chage == true){
                    answers_final[i] = temp_str;
                }
                
                
            }


            // if (answers_final[i][0] == 'С' && answers_final[i][1] == 'л'){
            //     //answers_final[i] = answers_final[i].substring(answers_final[i].lastIndexOf('«')+1);



            //     answers_final[i] = answers_final[i].substring(0, answers_final[i].length - 1);
            //     answers_final[i] = answers_final[i].slice(0, -1);
                
            // }

            
        }

        console.log(answers_final);




        await page.goto(url)
        let arr4 = await page.evaluate(async(answers_final)=>{
            let inputs = document.querySelectorAll('.test_inp');
            console.log(inputs);
            let r= 0;
            for (let i = 6; i < (inputs.length); i++){
                inputs[i].value = answers_final[r];
                r++;
            }

            let end_inp = await document.querySelectorAll('input')[document.querySelectorAll('input').length-1];
            await end_inp.click();
            return;
        },answers_final)

        

        //await page.click(document.querySelectorAll('input')[document.querySelectorAll('input')-1]);

        let waiter = '';
        for (let i = 0; i < 10000000; i++){
            waiter+='';
        }

        //await page.waitForSelector('body > div.wrapper > div.sgia-main-content > center:nth-child(4) > div');

        //let end = document.querySelector('body > div.wrapper > div.sgia-main-content > center:nth-child(4) > div');
        //end.textContent = end.textContent + '(Наталье Анетольевне, от Романа)';

        function delay(time) {
            return new Promise(function(resolve) { 
                setTimeout(resolve, time)
            });
         }

        await delay(3000);

        await page.screenshot({ path: 'fullpage.png'});


        //await browser.close();



    }, 5000);
}


// для котировок

