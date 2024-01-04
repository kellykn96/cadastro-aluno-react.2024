"use client"
import { AlunosList } from '@/components/alunoList';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

type Alunos = {
  id: string;
  nome: string;
  nota1: string;
  nota2: string;
  idade: string;
};

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [alunos, setAlunos] = useState<Alunos[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Alunos[]>([]);


  const [nome, setNome] = useState('');
  const [idade, setidade] = useState('');
  const [nota1, setnota1] = useState('');
  const [nota2, setnota2] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await AsyncStorage.getItem('alunos');
      const data = result ? JSON.parse(result) : [];
      setAlunos(data);
      setFilteredAlunos(data);
    };
    fetchData();
  }, [])

  useEffect(() => {
    const filtered = alunos.filter(aluno => aluno.id.toLowerCase().includes(searchInput.toLowerCase()));
    setFilteredAlunos(filtered);
  }, [searchInput]);


  const registrarAluno = async () => {
    
      const aluno: Alunos = {
          id: Math.random().toString(),
          nome,
          idade,
          nota1,
          nota2
      };

      try{
      const alunoId = await AsyncStorage.getItem('alunos');
      const alunos = alunoId ? JSON.parse(alunoId): []
      alunos.push(aluno);
      await AsyncStorage.setItem('alunos', JSON.stringify(alunos));
      window.location.reload();
      }catch (error){
        console.log("Erro ao adicionar aluno")
      }
    }


  return (
    <div className='bg-white w-full h-full'>
      <div className='flex p-4 w-full h-full '>
        <div className='flex w-full justify-between flex-row items-center'>
          <p className='text-black font-bold'>Alunos</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Cadstrar aluno</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar aluno</DialogTitle>
                <DialogDescription>
                  As informaçoes serao salvas localmente
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input id="name" onChange={(e) => setNome(e.target.value)} value={nome} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="idade" className="text-right">
                    Idade
                  </Label>
                  <Input type='number' id="idade" onChange={(e) => setidade(e.target.value)} value={idade} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nota1" className="text-right">
                    Nota 1
                  </Label>
                  <Input type='number' id="nota1" onChange={(e) => setnota1(e.target.value)} value={nota1} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nota2" className="text-right">
                    Nota 2
                  </Label>
                  <Input type='number' id="nota2" onChange={(e) => setnota2(e.target.value)} value={nota2} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => registrarAluno()}>Cadastrar aluno</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Input placeholder='Pesquisar alunos'
     onChange={(e) => setSearchInput(e.target.value)}
     />
      <AlunosList items={filteredAlunos} />
    </div>
  )
}
