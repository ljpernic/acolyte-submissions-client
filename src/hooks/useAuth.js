import jwtDecode from 'jwt-decode'

const useAuth = () => {
    const thisReader = localStorage.getItem('reader');
//    console.log('useAuth thisReader: '+ thisReader)

    if(thisReader !== null) {
        const thisReaderObject = JSON.parse(thisReader);
        const thisToken = thisReaderObject.token;
//        console.log('useAuth thisToken: '+ thisToken)

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
    
//            console.log('useAuth isEIC: ' + isEIC)
//            console.log('useAuth isAssistant: ' + isAssistant)
//            console.log('useAuth isAssociate: ' + isAssociate)

        if (isEIC) topStatus = 'EIC submissions'
        if (isAssistant) topStatus = 'Assistant Editor'
        if (isAssociate) topStatus = 'Associate Editor'

//            console.log('useAuth topStatus: ' + topStatus)

        return { decodedName, decodedRole, topStatus, isEIC, isAssistant, isAssociate}
            }
        }
    return ('thisToken does not exist')
} 
export default useAuth




//   }