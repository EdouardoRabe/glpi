//    useEffect(() => {
//         const fetchConfig = async () => {
//             try {
//                 // const data = { name: "edouardo", value: "123" };
//                 // await post('/config', data);

//                 const data = { value: "edouardo" };
//                 await put('/config/edouardo', data);

//                 const config = await get('/config');
//                 console.log('depuis express:', config);
//             } catch (error) {
//                 console.error('Erreur:', error);
//             }
//         };
//         fetchConfig();
//     }, []);