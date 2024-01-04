import Modal from "react-modal"
import React, { useState, FormEvent, useEffect  } from 'react';
import styles from './styles.module.scss'
import {FiX} from 'react-icons/fi'
import { setupAPIClient } from "@/src/services/api";
import {toast} from 'react-toastify'

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

  interface ModalOrderProps{
    isOpen: boolean;
    onRequestClose: () => void;
    result: ResultItemProps[]
    selectedBimestrePosition: number;
    onSelectBimestre: (bimestre: Bimestre | null) => void;
    onUpdate: () => void;
}

export function ModalResult({ isOpen, onRequestClose, result, selectedBimestrePosition, onSelectBimestre, onUpdate}: ModalOrderProps){
    const [nota, setNota] = useState<number | ''>('');
    const [selectedDisciplina, setSelectedDisciplina] = useState<string | null>(null);
    const [bimestreCreate, setBimestreCreate] = useState<Bimestre | ''>(''); // Alteração aqui
    const [selectedBimestre, setSelectedBimestre] = useState<Bimestre | null>(null);
    
    const [position, setPosition] = useState(0);

    const [isFormValid, setIsFormValid] = useState(true);

    useEffect(() => {
        if (isOpen && selectedBimestrePosition !== null) {
          const bimestreForPosition = getBimestreByPosition(selectedBimestrePosition);
          setSelectedBimestre(bimestreForPosition);
          setBimestreCreate(bimestreForPosition); // Configurando o estado bimestreCreate
        }
      }, [isOpen, selectedBimestrePosition]);
    
      const getBimestreByPosition = (position: number): Bimestre => {
        // Lógica para mapear a posição do botão para o bimestre correspondente
        switch (position) {
          case 0:
            return Bimestre.PRIMEIRO;
          case 1:
            return Bimestre.SEGUNDO;
          case 2:
            return Bimestre.TERCEIRO;
          case 3:
            return Bimestre.QUARTO;
          default:
            return Bimestre.PRIMEIRO;
        }
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

      const getBimestreNumberDisplay = (bimestre: Bimestre | null): string => {
        if (bimestre) {
          return getBimestreNumber(bimestre).toString();
        }
        return '';
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Substituir vírgula por ponto
  const sanitizedValue = inputValue.replace(',', '.');

      /// Verificar se o valor é válido
      if (sanitizedValue === '' || (/^\d*\.?\d{0,1}$/.test(sanitizedValue) && parseFloat(sanitizedValue) >= 0 && parseFloat(sanitizedValue) <= 10)) {
        setNota(sanitizedValue === '' ? '' : parseFloat(sanitizedValue));
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
  };

  const handleDisciplinaClick = (e: React.MouseEvent<HTMLButtonElement>, disciplina: string) => {
    e.preventDefault();
    setSelectedDisciplina(disciplina);
  };

    const allDisciplines = ["Biologia", "Artes", "Geografia", "Sociologia"];

    const bimestre = result.length > 0 ? result[0].bimestre : '';

    const customStyles = {
        content: {
          top: '50%',
          bottom: 'auto',
          left: '50%',
          right: 'auto',
          padding: '30px',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#0F0F0F',
          maxWidth: '600px', // Set a maximum width for the modal
          width: '100%', // Allow the modal to take full width on smaller screens
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

      async function handleConfirmClick(event: FormEvent) {
        event.preventDefault();
    
        try {
            if (selectedDisciplina === null) {
                toast.error('Selecione uma disciplina primeiro');
                return;
            }
            else if(nota === ''){
                toast.error('Insira uma nota para a disciplina');
                return;
            }
            else{
              const apiCLient = setupAPIClient();
              await apiCLient.post('/result/create', {
                bimestre: bimestreCreate,
                disciplina: selectedDisciplina,
                nota: nota,
            });

            toast.success('Disciplina cadastrada com sucesso!');
            setNota('');
            setSelectedDisciplina(null);
            onSelectBimestre(selectedBimestre);
            onRequestClose();

             // Chama a função onUpdate para atualizar a listagem
            onUpdate();
            }

        } catch (error) {
            console.error('Erro ao cadastrar disciplina:', error);
            toast.error('Erro ao cadastrar disciplina. Tente novamente.');
        }
    }

    return (

        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <div className={styles.content}>
        <form>
          <div className={styles.column}>
            <h2>{`Bimestre ${getBimestreNumberDisplay(selectedBimestre)}`}</h2>
            {/* {selectedDisciplina && <p>Disciplina Selecionada: {selectedDisciplina}</p>} */}
            <div style={{ cursor: 'pointer' }}>
              <FiX size={30} onClick={onRequestClose}/>
            </div>
          </div>
          <p>Disciplina</p>
          <div className={styles.row}>
            {allDisciplines.map((disciplina, index) => (
              <button
              key={index}
              className={`${styles.disciplina} ${getColorClass(disciplina)} ${result.some(item => item.disciplina === disciplina) ? styles.createdDisciplina : ''} ${selectedDisciplina === disciplina ? styles.selectedDisciplina : ''}`}
              onClick={(e) => handleDisciplinaClick(e, disciplina)}
            >
              {disciplina}
            </button>
            ))}
          </div>
          <div className={styles.nota}>
            <p>Nota</p>
            <input
              type="number"
              min={0}
              max={10}
              value={nota}
              onChange={handleChange}
            />
            {!isFormValid && (
              <p className={styles.errorMessage}>
                A nota deve estar entre 0 e 10.
              </p>
            )}
          </div>

          <div className={styles.buttonSubmit}>
            <button type="button" onClick={handleConfirmClick}>
                Confirmar
            </button>
          </div>
        </form>
      </div>
    </Modal>
    )
}