const TASK_LIST_KEY = "TASK_LIST_KEY";

export const newTask: Task = {
  id: uuidv4(),
  title: "朝九晚五",
  taskType: "unrestricted",
  start: dateUtils().hour(9).minute(0).second(0).millisecond(0).valueOf(),
  end: dateUtils().hour(17).minute(0).second(0).millisecond(0).valueOf(),
  color: "#a21211",
};

const defaultList: Task[] = [newTask];
export default function useTaskList() {
  const [taskList, setTaskList] = useState<Task[]>(defaultList);

  useEffect(() => {
    cache.getItem<Task[]>(TASK_LIST_KEY, defaultList).then((data) => {
      setTaskList(data);
    });
    function showDate(allLocalData: { [name: string]: chrome.storage.StorageChange }) {
      const { newValue } = allLocalData[cache.baseKey];

      const data = newValue?.[TASK_LIST_KEY];
      setTaskList(data || defaultList);
    }
    cache.storage.onChanged.addListener(showDate);

    return () => {
      cache.storage.onChanged.removeListener(showDate);
    };
  }, []);

  return {
    taskList,
    setList: (list: Task[]) => cache.setItem(TASK_LIST_KEY, list),
  };
}
