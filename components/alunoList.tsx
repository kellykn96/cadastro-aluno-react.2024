import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Menu, MoreHorizontal, Pencil, PencilIcon, SquareDot, Trash, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Link from "next/link";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
  

type Alunos  = {
  id: string;
  nome: string;
  nota1: string;
  nota2: string;
  idade: string;
};

interface AlunosListProps {
  items: Alunos[]

}

export const AlunosList = ({
  items
}: AlunosListProps) => {
  const [nome, setNome] = useState('');
    const [idade, setidade] = useState('');
    const [nota1, setnota1] = useState('');
    const [nota2, setnota2] = useState('');
  const { toast } = useToast()
  const router = useRouter()
  const getAlunoData = async (id: string) => {
    try {
        const alunosString = await AsyncStorage.getItem('alunos');
        const alunos = alunosString ? JSON.parse(alunosString) : [];
        const aluno = alunos.find((aluno: { id: string | string[]; }) => aluno.id === id);
        setNome(aluno.nome);
        setidade(aluno.idade);
        setnota1(aluno.nota1);
        setnota2(aluno.nota2);
        console.log(nota1)
    } catch (error) {
    }
}

  const deleteAluno = async (id: string) => {
    try {
      const updatedAlunos = items.filter(aluno => aluno.id !== id)
      await AsyncStorage.setItem('alunos', JSON.stringify(updatedAlunos))
      
      toast({
        title: "Operação concluida",
        description: "Aluno deletado do banco de dados",
      })
    window.location.reload();
    } catch (error) {
      console.log("Erro ao deletar api")
    }
  }

  const updateAluno = async (id: string) => {
    try {
       const alunosString = await AsyncStorage.getItem('alunos');
       const alunos = alunosString ? JSON.parse(alunosString) : [];
       console.log(alunos)
       const updatedAlunos = alunos.map((aluno: { id: string | string[]; }) => aluno.id === id ? { ...aluno, nome, idade, nota1, nota2 } : aluno);
       await AsyncStorage.setItem('alunos', JSON.stringify(updatedAlunos));
       window.location.reload()
    } catch (error) {
    } finally {
    }
   }
    
   const calculateAverage = (aluno: Alunos): number => {
    const nota1 = parseInt(aluno.nota1.toString())
    const nota2 = parseInt(aluno.nota2.toString())
    return (nota1 + nota2);
};
  return (
    <div>
        
  <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Id</TableHead>
      <TableHead>Nome</TableHead>
      <TableHead>Idade</TableHead>
      <TableHead>Nota 1</TableHead>
      <TableHead>Nota 2</TableHead>
      <TableHead >Nota final</TableHead>
      <TableHead className="text-right"><MoreHorizontal/></TableHead>

      
    </TableRow>
  </TableHeader>
  {items.map((items) => (
  
    <TableBody>
     
    <TableRow>

      <TableCell className="font-medium">{items.id}</TableCell>
      <TableCell>{items.nome}</TableCell>
      <TableCell>{items.idade}</TableCell>
      <TableCell>{items.nota1}</TableCell>
      <TableCell>{items.nota2}</TableCell>
      <TableCell>{calculateAverage(items)}</TableCell>
      <TableCell className="text-right">
        <div className="flex flex-row gap-x-2">
        <Dialog onOpenChange={()=> getAlunoData(items.id)}>
            <DialogTrigger asChild>
              <Button variant="outline">Editar aluno</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Editar aluno</DialogTitle>
                <DialogDescription>
                  As informaçoes serao salvas localmente
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input id="name" value={nome} onChange={(e) => setNome(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="idade"  className="text-right">
                    Idade
                  </Label>
                  <Input type='number' id="idade" value={idade} onChange={(e) => setidade(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nota1" className="text-right">
                    Nota 1
                  </Label>
                  <Input type='number' id="nota1" value={nota1} onChange={(e) => setnota1(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nota2" className="text-right">
                    Nota 2
                  </Label>
                  <Input type='number' id="nota2" onChange={(e) => setnota2(e.target.value)} value={nota2} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={()=> updateAluno(items.id)}>Editar aluno</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        <Button size="icon" variant="destructive" onClick={()=> deleteAluno(items.id)}><Trash2 color="black"/></Button>
          </div>
      </TableCell>
    </TableRow>
    
  </TableBody> 
  
  ))}
</Table>

       
      

    </div>
  )
}