
export async function conectedDB(){
    try{
        const response = await fetch('./dbmaterias.json');
        const dados = await response.json();

        return dados.materias;
    }catch(error){
        alert(error)
    }
}

export function GETinfo(codigo,listaMaterias){
    for (let materia of listaMaterias){
        if (materia.codigo == codigo){
            return materia
        }
    }
    return {}
}

export async function addHTML(){
    const inputSearch = document.querySelector("input[type='search']");
    if (inputSearch.value.length > 1){
        const MATERIAS = await conectedDB();
        const content = document.querySelector('.content');
        content.innerHTML = '';
        //alert(90)
        let fiol = MATERIAS.filter((mat) => {
            let SeacherMateria = inputSearch.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            let tamSM = SeacherMateria.length
            let NameMaterias = mat.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").slice(0, tamSM); 
            if(SeacherMateria == NameMaterias){
                return true
            }
            return false;
        })
        
        let cont = 0
        for (let element of fiol){
            cont += 1
            content.innerHTML += `<div onclick="PesquiNome('${element.codigo}')" class='pesquiname'">${element.nome}
            <div class='pcode'>${element.codigo}</div>
            </div>` 
            
            if (cont >= 7){
                break;
            }  
        }
    }else{
        const content = document.querySelector('.content');
        content.innerHTML = '';
    }
}