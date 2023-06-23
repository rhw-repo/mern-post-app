// rubber duck excercise to make a select for all tags from db

const TempSelect = () => {
    const [existingTags, setExistingTags] = useState([])

    useEffect(() => {
        fetchTags();
    }, [])

    const fetchTags = async () => {
        // Fetch tags from backend and store them in existingTags state
        // For example, you can use fetch or axios to make the API call
        const fetchedTags = await getTagsFromBackend()
        setExistingTags(fetchedTags)
    };
}



export default TempSelect;