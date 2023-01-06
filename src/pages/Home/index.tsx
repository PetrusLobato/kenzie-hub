import { useContext } from 'react';
import {Form, Figure, LinkStyle as Link} from './style';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../../validations/RegisterLogin';
import { AuthContext } from '../../contexts/AuthContext';
import logo from '../../assets/img/Logo.svg';

export interface ILoginForm{
  password: string;
  email: string;
}


const Home = () => {

  
  const {onSubmitLogin, loading} = useContext(AuthContext);
 
  const { register, handleSubmit, formState:{errors} } = useForm<ILoginForm>(
    {
     resolver: yupResolver(schema),
    });



  return (
   <>
    <Figure>
      <img src={logo} alt="logo" /> 
    </Figure>
    <Form onSubmit={handleSubmit(onSubmitLogin)}>

      <h3>Login</h3>
      <label htmlFor="email">Email</label>
      <input id='email' type="text" {...register('email')}/>
      
      <p className='erro'>{errors.email?.message}</p>

      <label htmlFor="senha">Senha</label>
      <input id='senha' type="password" {...register('password')}/>
      
      <p className='erro'>{errors.password?.message}</p>

      <button type='submit' disabled={loading}>
        <span>{loading ? 'Entrando...' : 'Entrar'}</span>
      </button>

      <p>Ainda não possui uma conta?</p>

      <Link to = 'register'>
        <span>Cadastre-se</span>
      </Link>

    </Form>
   
   
   </>
  )
}

export default Home