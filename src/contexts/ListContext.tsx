import { AxiosError } from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ITechForm } from "../pages/Modal";
import { instance } from "../service/api";
import { AuthContext, IAxiosError, IUser } from "./AuthContext";



export interface IChildrenProps{
    children: ReactNode;
}

export interface Ilist{
    id: string;
    title: string;
    status: string;
    created_at: string;
    updated_at: string;

}

interface IListContext{
    addTech:(data: ITechForm) => Promise<void>;
    deleteItem: (elemento: Ilist) => Promise<void>;
    list: Ilist[];
}

interface IResponseAddTechs{
    id: string;
	title: string;
	status: string;
	user: {id: string;},
	created_at: string;
	updated_at:string;
}


export const ListContext = createContext({} as IListContext);

export const ListProvider = ({children}: IChildrenProps) => {

    const navigate = useNavigate();

    const { token, user } = useContext(AuthContext);

    const [ list, setList ] = useState<Ilist[]>(user!.techs);
   
   
    
    async function addTech(data: ITechForm):Promise<void>{
  
        try {

        instance.defaults.headers.authorization = `Bearer ${token}`;

        const response = await instance.post<IResponseAddTechs>('/users/techs', data);
        
        
        const responseUser = await instance.get<IUser>(`/users/${response.data.user.id}`);
        
        
        toast.success('Tecnologia cadastrada com sucesso');
        
        setList(responseUser.data.techs);
            
            
        } catch (error) {
            const requestError = error as AxiosError<IAxiosError>;
            toast.error(requestError.response?.data.message);
        }finally{
            navigate(-1)
        }
    }
        

    async function deleteItem(elemento: Ilist):Promise<void>{

        {
            if(list) {

                const newList = list.filter((item) => elemento.id !== item.id);  

                setList(newList);

            } 
                
        }

        await instance.delete(`/users/techs/${elemento.id}`)
    }

     
    return(

        <ListContext.Provider value={{addTech, deleteItem, list}}>

            {children}

        </ListContext.Provider>

    )


}

