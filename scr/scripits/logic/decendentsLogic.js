import {conectedDB, GETinfo, addHTML} from '../geral.js'

// {} = {
//     "codigo" : nausddniasd,
//     "nomeBolha" : calculo I,

//     "listMaterias" : [
//         {"type": "nop",
//          "codigo" :"ashbdfabsh",
//          "prerequisito" :"ashbdfabsh"
//         }
//     ]

// }

// [
//     [{},{},{}],
//     [{},{},{}],
//     [{},{},{}],
//     [{},{},{}],
    
// ]
function listMateAntecessoras(listGrade, mateMiseri){
    let newListGrade = []
    if (listGrade == null){
        return [mateMiseri.codigo];
    }
  //  alert(12)

    if (listGrade.length > 0){
        newListGrade = listGrade
    }
    
    let listMate = []
   // alert(newListGrade)
    newListGrade.map((mate) => {
        for (let mate2 of mate.listMaterias) {
          //  alert(13);
            if (!listMate.includes(mate2.codigo)) {listMate.push(mate2.codigo)}
        }
    })
    return listMate;
}


export async function CriarGrade(codMat = []) {
    const MATERIAS = await conectedDB();
    let codigo = ""
    if (codMat.length > 0){codigo = codMat[0]}
    let materiaPesquisada = GETinfo(codigo,MATERIAS);
    let gradeMaterias = []
    
    ///METERIAS AZUIS///
    ///===========================================================//
    let id = 0;
    for (let i = 0; i<6; i+= 1){
        let coluna = [];
        let materiasAntecessoras = listMateAntecessoras(gradeMaterias[id-1],materiaPesquisada);
       // alert(materiasAntecessoras)
        materiasAntecessoras.map((mate) => {
            coluna.push({ "codigo" : mate, "nome" : GETinfo(mate,MATERIAS).nome,"listMaterias" : [] })
            for (let materia of MATERIAS){
                if (materia.prerequisito.length > 0){
                    if (materia.prerequisito.includes(mate)){
                        coluna.at(-1).listMaterias.push({ "type" : "direto","cargaHoraria": materia.cargaHoraria, "nome" : materia.nome, "codigo" : materia.codigo, "prerequisito" : materia.prerequisito })
                    }
                }
            }
        })
        //alert(coluna)
        if (coluna.length == 0){
            break;
        }
        if (gradeMaterias.length == 0){
            gradeMaterias[id] = coluna
        }else{
            alert(`${id} -> ${coluna.at(-1).nome}`)
            gradeMaterias.push(coluna)
        }
        id += 1;
    }
    //alert(gradeMaterias[3].at(0).nome)
    return gradeMaterias;
    ///===========================================================//
}

// ========================================================================  //
