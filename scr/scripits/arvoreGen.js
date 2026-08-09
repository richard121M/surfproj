import {conectedDB, GETinfo, addHTML} from './geral.js'

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
    }else{
        let colach = brickElement.parentNode;
        if (colach.id != `co${coluna}`){
            colach.removeChild(brickElement)
            colunaElement.innerHTML += `<div class="bricks" id="B-${BMcodigo}"> - ${BMnome} - </div>`
        }
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

export async function pesquisar(codMat = []) {
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
    for (let i = 0; i<8; i+= 1){
        grade.innerHTML += `<div class="colMate" id=co${i+1}></div>`;
        
        let adicionou = false;
        let lista_ = listGrade[id-1]; 
        lista_.map((mate) => {
            if (mate.prerequisito.length <= 0){
                //alert('nao tem prerequisito')
                return 0
            }
            
            mate.prerequisito.map((pre) => {               
                let prerequisitos = pre;
                if (prerequisitos.includes('&')){
                    prerequisitos = pre.split("&")
                }
                
                // alert(90)
                for (let materia of MATERIAS){
                        if (prerequisitos.includes(materia.codigo)){     
                            if (adicionou == false){
                                listGrade.push([ ]);
                            }
                            
                            CreateBrick(i+1,[mate],materia)
                            adicionou = true;
                                listamate2.push({mat : materia, coluna: i+1})
                                listGrade[id].push(materia);   
                        }
                }
            })
        })
        if (adicionou == false){
            break;
        }
            id += 1;
    }
    grade.removeChild(grade.lastElementChild);

    document.getElementById("codigo").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("codigo").focus();
}

let items = []

export async function PesquiNome(codigo){
    pesquisar([codigo])
}

// Torna a função acessível globalmente no navegador
window.pesquisar = pesquisar;
window.addHTML = addHTML;
window.PesquiNome = PesquiNome;