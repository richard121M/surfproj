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

    newListGrade.map((mate) => {
        for (let mate2 of mate.listMaterias) {

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
    let allMaterias = []
    for (let i = 0; i<6; i+= 1){
        let coluna = [];

        let materiasAntecessoras = listMateAntecessoras(gradeMaterias[id-1],materiaPesquisada);
        materiasAntecessoras.map((antMate) => {
            let antemateria = GETinfo(antMate,MATERIAS)
            let clone = {"nome": antemateria.nome, "codigo": antemateria.codigo}
            if (!allMaterias.includes(clone)){allMaterias.push(clone)}
        })

        ///Materias Azuis///
        ///======================================================================================//
        materiasAntecessoras.map((mate) => {
            coluna.push({ "codigo" : mate, "nome" : GETinfo(mate,MATERIAS).nome,"listMaterias" : [] })
            MATERIAS.splice(MATERIAS.indexOf(GETinfo(mate,MATERIAS)),1) 
            for (let materia of MATERIAS){
                if (materia.prerequisito.length > 0){
                    if (materia.prerequisito.includes(mate)){
                        //materia-azul
                        coluna.at(-1).listMaterias.push({ "type" : "","cargaHoraria": materia.cargaHoraria, "nome" : materia.nome, "codigo" : materia.codigo, "prerequisito" : materia.prerequisito })
                        
                    }
                }
            }
            if (coluna.at(-1).listMaterias.length == 0){coluna.splice(coluna.indexOf(coluna.at(-1)),1)}
        })
        ///======================================================================================//

        if (allMaterias.length > 1){
            for (let materia of MATERIAS){
                materia.prerequisito.map((preRequi) => {
                    let preRequisito = []
                    preRequi.includes('&') ? preRequisito = preRequi.split("&") : preRequisito = [preRequi]
                    let cont = preRequisito.length
                    if (cont <= 1){
                        return 0;
                    }

                    let whoMate = []
                    for (let all of allMaterias){
                        if (preRequisito.includes(all.codigo)){
                            whoMate.push(all)
                            cont -=1;
                        }
                    }
                    
                    if (cont == 0){
                        let nomeb = "";
                        let codigob = "";
                        for (let a of whoMate){
                            nomeb +=  `(${a.nome}) \n`
                            codigob += "&" + a.codigo
                        }
                        
                        coluna.push({ "codigo" : codigob, "nome" : nomeb,"listMaterias" : [] })
                        coluna.at(-1).listMaterias.push({ "type" : "nop","cargaHoraria": materia.cargaHoraria, "nome" : materia.nome, "codigo" : materia.codigo, "prerequisito" : materia.prerequisito })
                    }
                })
            }
        }

        //alert(coluna)
        if (coluna.length == 0){
            break;
        }
        if (gradeMaterias.length == 0){
            gradeMaterias[id] = coluna
        }else{
            gradeMaterias.push(coluna)
        }
        id += 1;
    }

    return gradeMaterias;
    ///===========================================================//
}

// ========================================================================  //
