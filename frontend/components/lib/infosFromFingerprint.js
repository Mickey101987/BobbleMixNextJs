import { decodeb64 } from './base64';
export const infosFromFingerprint = (f) => {
    // get an arr of all arome and their ratio in the mix
    const fullName = decodeb64(String(f)).split('/');
    const array = fullName.map((a) => {
        const ar = String(a.split('%')[1]);
        const obj = {
            percent: Number(a.split('%')[0].trim()),
            arome: ar.trim().replace(/-/g, ' '),
        };
        return obj;
    });
    return array;
};
