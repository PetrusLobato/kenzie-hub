export interface IElementoProps{
    elemento: IObjElmento;
}

interface IObjElmento{
    id: string;
    title: string;
    status: string;
    created_at: string;
    updated_at: string;
}