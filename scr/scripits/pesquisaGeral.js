import {conectedDB, GETinfo, addHTML} from './geral.js'
// import {} from './scr/scripits/geral.js'


let codigosCadastrados = [];
        
function UPlistMaterias(listap,semPre,listaMaterias){
    listaMaterias.map((materia) => {
        if (codigosCadastrados.includes(materia.codigo) == false){
            if (materia.prerequisito.length > 0){
                let preReq = materia.prerequisito;
                
                preReq.map(async (pre) => {
                    if (pre.includes("&") == false){
                        if (codigosCadastrados.includes(pre)){
                            const nomePre = GETinfo(pre,listaMaterias).nome; 
                            listap.innerHTML += `
                            <div class="materia">
                                <div class="preReq">
                                    <h3 title="${nomePre}">${pre}</h3>
                                </div>
                                <div class="Htext">
                                    <div class="infoMat">
                                        <h5>${materia.codigo}</h5>
                                        <h5>${materia.cargaHoraria}</h5>
                                    </div>
                                    <div>
                                        <h3>${materia.nome}</h3> 
                                        <p>${materia.unidadeAcademica}</p>
                                    </div>
                                </div>
                            </div>`;
                            }
                        }else{
                        let listdpend = pre.split("&");
                        let cumpri = listdpend.length;
                        let prep = '';
                        for (let mate of listdpend){
                            if (codigosCadastrados.includes(mate)){
                                cumpri = cumpri -1;
                                const nomePre = GETinfo(mate,listaMaterias).nome; 
                                prep += `<h3 title="${nomePre}">${mate}</h3>`;
                                
                            }
                        }
                        
                        if (cumpri == 0){
                            listap.innerHTML += `
                            <div class="materia">
                                <div class="preReq">
                                    ${prep}
                                </div>
                                <div class="Htext">
                                    <div class="infoMat">
                                        <h5>${materia.codigo}</h5>
                                        <h5>${materia.cargaHoraria}</h5>
                                    </div>
                                        <div>
                                        <h3>${materia.nome}</h3> 
                                        <p>${materia.unidadeAcademica}</p>
                                    </div>
                                </div>
                            </div>`;
                        }
                    }
                })
            }else if (semPre){
                listap.innerHTML += `
                <div class="materia">
                    <div class="Htext">
                        <div class="infoMat">
                            <h5>${materia.codigo}</h5>
                            <h5>${materia.cargaHoraria}</h5>
                        </div>
                        <div>
                            <h3>${materia.nome}</h3> 
                            <p>${materia.unidadeAcademica}</p>
                        </div>
                    </div>
                </div>`;
            }
        }
    })
}

function validarCodigo(cod,listaMaterias) {
    let materiaExite = false
    
    listaMaterias.map((materia) => { 
        if (materia.codigo == cod){    
            materiaExite = true;
            if (codigosCadastrados.includes(cod) == false){
                codigosCadastrados.push(cod);
            }
        }
    })

    if (!materiaExite){            
        alert(`a materia com o codigo ${cod} nao exixte`);
        return false;
    }
    return true
}

export async function PesquiNome(codigo){
    adicionar(codigo)
}
export async function removerSM(codigo){
    let elementSM = document.getElementById(`SM-${codigo}`);
    elementSM.remove();
    codigosCadastrados = codigosCadastrados.filter(mat => mat !== codigo);
    
    const MATERIAS = await conectedDB();
    let listap = document.getElementById("disciplinasPode");
    let check = document.getElementById("preRequesi");
    listap.innerHTML = ``;
    UPlistMaterias(listap,check.checked,MATERIAS);
}

async function adicionar(codigod = '') {
    const MATERIAS = await conectedDB();
    let codigo = document.getElementById("codigo").value.trim();
    let check = document.getElementById("preRequesi");
    if (codigod.length > 3){
        codigo = codigod; 
    }
    
    // Pega o valor definido no HTML
    
    let listap = document.getElementById("disciplinasPode");
    let lista = document.getElementById("listaDisciplinas");
    
    if (codigo.length > 3){
        if (validarCodigo(codigo,MATERIAS)){
            listap.innerHTML = ``;
            UPlistMaterias(listap,check.checked,MATERIAS);
        }else{
            alert(`o codigo ${codigo} ja foi informado`);
        }
    }else{
        listap.innerHTML = ``;
        UPlistMaterias(listap,check.checked,MATERIAS);
    }

    lista.innerHTML = '';
    codigosCadastrados.map((mat) => {
        let materiaM = GETinfo(mat,MATERIAS);
        lista.innerHTML += `
        <div id="SM-${mat}" class="SuaMateria">
            <div>
                <h3>${materiaM.nome}</h3> 
            </div>
            <div class="infoMat">
                <h5>${mat}</h5>
                <div onClick="removerSM('${mat}')" class="SuaMateriaRemove">
                <p>remover</p>
                </div>
            </div>
        </div>`;
    })
    
    
    document.getElementById("codigo").value = "";
    // document.getElementById("nome").value = "";
    // document.getElementById("codigo").focus();
}
const botao = document.getElementById("oiB");
const inputNome = document.getElementById("nome");
const checkBox = document.getElementById("preRequesi")

botao.onclick = () => {
    adicionar()   
}

inputNome.oninput = () => {
    addHTML([])
}

checkBox.onchange = () => {
    adicionar()
}

// Torna a função acessível globalmente no navegador
window.removerSM = removerSM;
window.PesquiNome = PesquiNome;
// ========================================================================  //
