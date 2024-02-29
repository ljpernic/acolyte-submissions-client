//////// HOOK
//////// CHECKS IF LOGGED-IN READER IS AUTHORIZED

import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const thisReader = localStorage.getItem('reader');

    if(thisReader !== null) {
        const thisReaderObject = JSON.parse(thisReader);
        const thisToken = thisReaderObject.token;

        let isEIC = false;
        let isAssistant = false;
        let isAssociate = false;
        let topStatus = 'undefinedEditor'; 

        if (thisToken) {
            const decodedToken = jwtDecode(thisToken)
            const decodedName = decodedToken.name;
            const decodedRole = decodedToken.role;

        isEIC = decodedRole.includes('EIC')
        isAssistant = decodedRole.includes('assistantEditor')
        isAssociate = decodedRole.includes('associateEditor')
    
        if (isEIC) topStatus = 'EIC Queue'
        if (isAssistant) topStatus = 'Assistant Editor'
        if (isAssociate) topStatus = 'Associate Editor'

        return { decodedName, decodedRole, topStatus, isEIC, isAssistant, isAssociate}
            }
        }
    return ('thisToken does not exist')
} 
export default useAuth

