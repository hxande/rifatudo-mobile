export default interface IUser {
    id?: number;
    username: string;
    pass: string;
    email: string;
    first_name: string;
    surname: string;
    birth: string;
    sex: number;
    cpf: string;
    created_at?: string;
    updated_at?: string;
}