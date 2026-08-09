import {conectedDB, GETinfo} from './geral.js'

function CreateBrick(coluna,BrickMateria,BolhaMateria,flag=''){
    let colunaElement = document.getElementById(`co${coluna}`);
    if (colunaElement == null){
        alert('coluna nao encotrada')
        return 'C'
    }
    let BMcodigo = '';
    let BMnome = '';
    BrickMateria.map((BM) =>{
        BMcodigo += BM.codigo;
        BMnome += BM.nome + ' e ';
    })
    let brickElement = document.getElementById(`B-${BMcodigo}`);
    if (brickElement == null ){
        colunaElement.innerHTML += `<div class="bricks" id="B-${BMcodigo}"> - ${BMnome} - </div>`
    }
    brickElement = document.getElementById(`B-${BMcodigo}`);
    if (flag != 'nope'){
        brickElement.innerHTML += `<div class="bolha${flag}">
        <div class='CH'><p>${BolhaMateria.cargaHoraria}</p></div>
        <div><p>${BolhaMateria.codigo} - ${BolhaMateria.nome} </p></div>
        </div>`;

    }else{
        brickElement.innerHTML += `<div class="bolha${flag}">
        <div class='CH'><p>${BolhaMateria.cargaHoraria}</p></div>
        <div><p>${BolhaMateria.codigo} - ${BolhaMateria.nome} </p> <p>${BolhaMateria.prerequisito}</p></div>
        </div>`;
        
    }

}

export async function CriarGrade(codMat = []) {
    const MATERIAS = await conectedDB();
    
    let codigo = document.getElementById("codigo").value.trim();
    if (codMat.length > 0){
        codigo = codMat[0]
    }
    //let check = document.getElementById("preRequesi");
    let listGrade = [[GETinfo(codigo,MATERIAS)],];
    let listamate2 = [{mat : GETinfo(codigo,MATERIAS), coluna: 0}];

    let grade = document.getElementById("quadro");
    grade.innerHTML = '';
    let id = 1;
  
        ///METERIAS AZUIS///
        ///===========================================================//
        for (let i = 0; i<6; i+= 1){
            grade.innerHTML += `<div class="colMate" id=co${i+1}></div>`;

            let adicionou = false;
            let lista_ = listGrade[id-1]; 
            lista_.map((mate) => {
                    for (let materia of MATERIAS){
                        if (materia.prerequisito.length > 0){
                        let prerequisitos = materia.prerequisito
                            if (prerequisitos.includes(mate.codigo)){

                                if (adicionou == false){
                                    listGrade.push([ ]);
                                }

                                CreateBrick(i+1,[mate],materia)
                                adicionou = true;
                                listamate2.push({mat : materia, coluna: i+1})
                                listGrade[id].push(materia);   
                            }
                        }
                    }
                })
            if (adicionou == false){
                break;
            }
            id += 1;
        }
        ///METERIAS AMARELAS///
        for (let materia of MATERIAS){
            let prerequisitos = materia.prerequisito
            if (prerequisitos.length > 0){
                prerequisitos.map((pre) => {
                    if (pre.includes("&")){
                        let PRE = pre.split("&")
                        let cont = PRE.length;
                        let col = 0;
                    
                        let ListBM = [];
                        listamate2.map((mater) =>{
                            if (PRE.includes(mater.mat.codigo)){
                                cont -= 1;

                                col = mater.coluna +1;
                                ListBM.push(mater.mat)
                                if (cont == 0){
                                    CreateBrick(col,ListBM,materia,'nop')    
                                }
                            }
                        })
                        if (cont == 0){
                            listamate2.push({mat : materia, coluna: col})
                            listGrade[col-1].push(materia);   
                        }
                    }
                })
            }
        }

        ///METERIAS VERMELHAS///
        for (let materia of MATERIAS){
            let prerequisitos = materia.prerequisito
            if (prerequisitos.length > 0){
                prerequisitos.map((pre) =>{

                    if (pre.includes("&")){
                        let PRE = pre.split("&")
                        let cont = PRE.length;
                        let col = 0;
                        
                        let ListBM = [];
                        listamate2.map((mater) =>{
                            if (PRE.includes(mater.mat.codigo)){
                                cont -= 1;
                                ListBM.push(mater.mat);
                                col = mater.coluna +1;
                            }
                        })
                        
                        if (cont > 0 && cont < PRE.length){
                            CreateBrick(col,ListBM,materia,'nope');
                            listamate2.push({mat : materia, coluna: col})
                            listGrade[col-1].push(materia);   
                        }
                        
                    }
                })
            }
        }
        let ultimaColuna = grade.lastElementChild;
        if (ultimaColuna.lastElementChild == null){
            ultimaColuna.remove()
        }
    

    document.getElementById("codigo").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("codigo").focus();
}

let items = []

async function addHTML(){
    const inputSearch = document.querySelector("input[type='search']");

    if (inputSearch.value.length >= 2){
        const MATERIAS = await conectedDB();
        const content = document.querySelector('.content');
        content.innerHTML = '';
        //alert(90)
        let fiol = MATERIAS.filter((mat) => 
            mat.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(inputSearch.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
        )
        //alert(fiol)
        let cont = 0
        for (element of fiol){
            //alert(90)
            //addHTML()
            cont += 1
            //const div = document.createElement("div");
            //div.innerHTML = element.nome;
            content.innerHTML += `<div onclick="PesquiNome('${element.codigo}')" class='pesquiname'">${element.nome}
            <div class='pcode'>${element.codigo}</div>
            </div>` 

            //content.append(div);
            if (cont >= 10){
                break;
            }
            //items.push(element.nome);    
        }
    }
}

async function PesquiNome(codigo){
    CriarGrade([codigo])
}

// Torna a função acessível globalmente no navegador
window.CriarGrade = CriarGrade;
// ========================================================================  //
