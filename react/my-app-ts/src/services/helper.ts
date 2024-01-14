export const actualDate = (): string => {
    const currentDate: Date = new Date();
    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1;
    const day: number = currentDate.getDate();
    const formatedMonth = month.toString().length === 1 ? `0${month}` : month;
    const formatedDay = day.toString().length === 1 ? `0${day}` : day;

    return `${formatedDay}/${formatedMonth}/${year}`;
};

export const actualTime = (): string => {
    const currentDate: Date = new Date();
    const hours: number = currentDate.getHours();
    const minutes: number = currentDate.getMinutes();
    const formatedHours: string = hours.toString().length === 1 ? `0${hours}` : `${hours}`;
    const formatedMinutes: string = minutes.toString().length === 1 ? `0${minutes}` : `${minutes}`;
    return `${formatedHours}:${formatedMinutes}`;
};

export const formatMoney = (money: number | undefined): string => {
    return typeof money === 'undefined' ? 'R$ 0,00' : `R$ ${money.toFixed(2).replace('.', ',')}`;
};