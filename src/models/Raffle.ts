export default interface IRaffle {
    id?: number;
    id_user: number;
    title: string;
    description: string;
    status: number;
    value: number;
    id_category: number;
    uf: string;
    city: string;
    qtt: number;
    qtt_free: number;
    qtt_min: number;
    qtt_winners: number;
    duration: number;
    created_at?: string;
    updated_at?: string;
}