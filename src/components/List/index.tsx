import { useContext } from 'react';
import {BsTrash} from 'react-icons/bs';
import { ListContext } from '../../contexts/ListContext';
import { IElementoProps } from './type';



const List = ({elemento}: IElementoProps) => {
  

  const {deleteItem} = useContext(ListContext);

  
  return (
    <li>
        <h6>{elemento.title}</h6>
        <div className='trash'>
            <p>{elemento.status}</p>
            <BsTrash onClick={() => deleteItem(elemento) }/>
        </div>
    </li>
  )
}

export default List