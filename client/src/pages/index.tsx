import Head from "next/head"
import { useState, FormEvent, useEffect } from "react";
import styles from '../../styles/Home.module.scss'
import { Button } from "../components/ui/button"
import { setupAPIClient } from "../services/api"
import Modal from 'react-modal'
import { ModalResult } from "../components/Modal";

import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";


  enum Bimestre {
    PRIMEIRO = "PRIMEIRO",
    SEGUNDO = "SEGUNDO",
    TERCEIRO = "TERCEIRO",
    QUARTO = "QUARTO",
  }
  
  enum Disciplina {
    Biologia = "Biologia",
    Artes = "Artes",
    Geografia = "Geografia",
    Sociologia = "Sociologia",
  }
  
  // Defina a interface para o modelo Resultado
 export type ResultItemProps = {
    id: string;
    bimestre: Bimestre;
    disciplina: Disciplina;
    nota: number;
    criadoEm: string;
    atualizadoEm: string;
  }

interface ResultProps{
    listResult: ResultItemProps[] | undefined,
    deleteResult: (resultId: string) => void;
  }

  export default function Home({ listResult, deleteResult }: ResultProps) {
    const initialState: Record<Bimestre, ResultItemProps[]> = {
      [Bimestre.PRIMEIRO]: [],
      [Bimestre.SEGUNDO]: [],
      [Bimestre.TERCEIRO]: [],
      [Bimestre.QUARTO]: [],
    };
    const [resultItems, setResultItems] = useState(initialState);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalItem, setModalItem] = useState<ResultItemProps[]>([]);
    const [selectedBimestre, setSelectedBimestre] = useState<Bimestre | null>(null);
    const [selectedBimestrePosition, setSelectedBimestrePosition] = useState<number | null>(null);

    function handleCloseModal() {
      setModalVisible(false);
    }
  
    async function handleOpenModalViewl(bimestre: Bimestre, position: number) {
      if (Object.values(Bimestre).includes(bimestre)) {
        const results = resultItems[bimestre] || [];
        setModalItem(results);
        setSelectedBimestrePosition(position);
        setSelectedBimestre(bimestre);
        setModalVisible(true);
      } else {
        console.error('Bimestre inválido:', bimestre);
      }
    }
  
    useEffect(() => {
      fetchOrders();
    }, []);
  
    const getResultItems = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/results');
        const resultItems = response.data;
        return resultItems;
      } catch (error) {
        console.error('Erro ao obter resultados:', error);
        return [];
      }
    };

    const handleDeleteResult = async (resultId: string) => {
      try {
        const apiClient = setupAPIClient();
        await apiClient.delete(`/result/remove/?result_id=${resultId}`);
        toast.success('Disciplina excluído com sucesso!');

        await fetchOrders();
    
      } catch (error) {
        console.error('Erro ao excluir disciplina:', error);
        toast.error('Erro ao excluir disciplina. Tente novamente.');
      }
    };
  
    const fetchOrders = async () => {
      const resultItems: ResultItemProps[] = await getResultItems();
  
      const organizedResults: Record<Bimestre, ResultItemProps[]> = { ...initialState };
  
      resultItems.forEach((item: ResultItemProps) => {
        const bimestre = item.bimestre as Bimestre;
        organizedResults[bimestre] = organizedResults[bimestre] || [];
        organizedResults[bimestre].push(item);
      });
      

  
      setResultItems(organizedResults);
    };
  
    const getBimestreNumber = (bimestre: Bimestre): number => {
      switch (bimestre) {
        case Bimestre.PRIMEIRO:
          return 1;
        case Bimestre.SEGUNDO:
          return 2;
        case Bimestre.TERCEIRO:
          return 3;
        case Bimestre.QUARTO:
          return 4;
        default:
          return 0;
      }
    };
  
    function getColorClass(disciplina: string) {
      switch (disciplina) {
        case 'Artes':
          return styles.azul;
        case 'Geografia':
          return styles.laranja;
        case 'Sociologia':
          return styles.roxo;
        case 'Biologia':
          return styles.rosa;
        default:
          return '';
      }
    }
  
    function getCorNotaClass(nota: number) {
      if (nota < 6) {
        return styles.vermelho;
      } else if (nota < 8) {
        return styles.amarelo;
      } else {
        return styles.verde;
      }
    }
  
    function getFormattedDate(dateString: string): string {
      const date = new Date(dateString);
  
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
  
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
  
      return `${day}/${month}/${year}`;
    }

    Modal.setAppElement('#__next');
  
    return (
      <>
        <Head>
          <title>Home</title>
        </Head>
        <div className={styles.container}>
          <main className={styles.header}>
            <form>
              {Object.entries(resultItems).map(([bimestre, results], index) => (
                <div key={bimestre} className={styles.body}>
                  <div className={styles.divTitle}>
                  <p>{`Bimestre ${getBimestreNumber(bimestre as Bimestre)}`}</p>
                  <Button
                      type="button"
                      onClick={() => handleOpenModalViewl(bimestre as Bimestre, index)}
                      loading={false}
                        >
                      Lançar nota
                    </Button>
                  </div>
  
                  <div className={styles.divBox}>
                    {results.map((item, index) => (
                      <div
                        className={`${styles.box} ${getColorClass(item.disciplina)}`}
                        key={index}
                      >
                      <div className={styles.boxHeader}>
                        <button type="button" onClick={() => handleDeleteResult(item.id)}><FiTrash2 size={25} color="#FF5964"/></button>
                          <strong>{item.disciplina}</strong>
                          <p>{`${getFormattedDate(item.criadoEm)}`}</p>
                        </div>
                        <div className={`${styles.nota} `}>
                          <p className={getCorNotaClass(item.nota)}>{`Nota: ${item.nota}`}</p>
                      </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </form>
          </main>
          {modalVisible && modalItem && selectedBimestrePosition !== null &&(
            <ModalResult 
              isOpen={modalVisible} 
              onRequestClose={handleCloseModal} 
              result={modalItem}
              selectedBimestrePosition={selectedBimestrePosition}
              onSelectBimestre={setSelectedBimestre}
              onUpdate={fetchOrders}
            />
          )}
        </div>
      </>
    );
  }
  
  export const getServerSideProps = async () => {
    try {
      const apiClient = setupAPIClient();
  
      const resultsResponse = await apiClient.get('/results');
      const deleteResultResponse = await apiClient.delete('/result/remove');
  
      return {
        props: {
          listResult: resultsResponse.data,
          deleteResult: deleteResultResponse.data
        },
      };
    } catch (error) {
      console.error('Erro ao obter resultados do servidor:', error);
      return {
        props: {
          listResult: [],
        },
      };
    }
  };