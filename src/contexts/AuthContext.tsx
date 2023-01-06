import { createContext, useEffect, useState } from "react";
import { instance } from "../service/api";
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
import { IChildrenProps, Ilist } from "./ListContext";
import { IRegisterForm } from "../pages/Register";
import { ILoginForm } from "../pages/Home";
import { AxiosError } from "axios";


export interface IUser{
  id: string;
  name: string;
  email: string;
  course_module: string;
  bio: string;
  contact: string;
  techs: Ilist [];
}

interface IResponseRegister extends IUser{
  created_at:string;
	updated_at: string;
	avatar_url: null;
}

interface IResponseLogin{
  user:IUser;
  token:string;
  works: [];
	created_at: string;
	updated_at: string;
	avatar_url: null
}

export interface IAxiosError{
  status: string;
  message: string;
}

interface IAuthContext{
  onSubmitLogin: (data: ILoginForm) => Promise<void>;
  onSubmitForm: (data: IRegisterForm) => Promise<void>; 
  user: IUser | null; 
  loading: boolean; 
  refreshing:boolean; 
  token:string | null;
}

export const AuthContext = createContext({} as IAuthContext);


export const AuthProvider = ({children}:IChildrenProps) => {


  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState(localStorage.getItem('@kenzie-hub:token') || null);
  const navigate = useNavigate();
  const location = useLocation();
 


  async function onSubmitForm(data: IRegisterForm):Promise<void>{

    try {

      setLoading(true);

      const response = await instance.post<IResponseRegister>('/users', data);
      
      toast.success('Cadastro Realizado com sucesso')
      
      navigate('/');

    } catch (error) {
      const requestError = error as AxiosError<IAxiosError>;
      toast.error(requestError.response?.data.message);

    } finally{
      
      setLoading(false);
      
    }

    
  } 
  

  useEffect(() => {

      async function loadUser(){

        if(token){
          try {

            instance.defaults.headers.authorization = `Bearer ${token}`;

            const {data} = await instance.get('/profile');

            setUser(data);

          } catch (error) {
              console.error(error)
          } finally {
              setRefreshing(false);
          }

        }

      }

      loadUser();

  },[])


  async function onSubmitLogin(data: ILoginForm): Promise<void>{
          
        try {

        setLoading(true);

        const response = await instance.post<IResponseLogin>('/sessions', data); 

        window.localStorage.clear();

        const { token, user: userResponse } = response.data;

        localStorage.setItem('@kenzie-hub:token', token);

        instance.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(userResponse);

        const toNavigate = location.state?.from.pathname || 'dashboard'

        toast.success('Logado com sucesso');

        navigate(toNavigate, {replace: true}) 
         // replace - seta de voltar, limpa a pagina anterios, não volta para o login 
  
        } catch (error) {
         
          const requestError = error as AxiosError<IAxiosError>;
          toast.error(requestError.response?.data.message);

        } finally{
          setLoading(false);
        }
 
  }

  return(

      <AuthContext.Provider value={{onSubmitLogin, onSubmitForm, user, loading, refreshing, token}}>
          {children}
      </AuthContext.Provider>

  )
}