import type { Employee } from "~/types";

export const useEmployeeStore = () => {
  const employees = useState<Employee[]>("employees", () => [
    {
      id: "P001",
      firstName: "Alice",
      lastName: "Johnson",
      department: "Engineering",
      email: "alice@company.com",
    },
    {
      id: "P002",
      firstName: "Bob",
      lastName: "Williams",
      department: "Marketing",
      email: "bob@company.com",
    },
    {
      id: "P003",
      firstName: "Charlie",
      lastName: "Brown",
      department: "Sales",
      email: "charlie@company.com",
    },
    {
      id: "P004",
      firstName: "Diana",
      lastName: "Miller",
      department: "HR",
      email: "diana@company.com",
    },
    {
      id: "P005",
      firstName: "Eve",
      lastName: "Davis",
      department: "Engineering",
      email: "eve@company.com",
    },
    {
      id: "P006",
      firstName: "Frank",
      lastName: "Garcia",
      department: "Finance",
      email: "frank@company.com",
    },
    {
      id: "P007",
      firstName: "Grace",
      lastName: "Rodriguez",
      department: "Marketing",
      email: "grace@company.com",
    },
    {
      id: "P008",
      firstName: "Henry",
      lastName: "Martinez",
      department: "Engineering",
      email: "henry@company.com",
    },
    {
      id: "P009",
      firstName: "Ivy",
      lastName: "Hernandez",
      department: "Sales",
      email: "ivy@company.com",
    },
    {
      id: "P010",
      firstName: "Jack",
      lastName: "Lopez",
      department: "HR",
      email: "jack@company.com",
    },
    {
      id: "P011",
      firstName: "Karen",
      lastName: "Gonzales",
      department: "Finance",
      email: "karen@company.com",
    },
    {
      id: "P012",
      firstName: "Liam",
      lastName: "Wilson",
      department: "Engineering",
      email: "liam@company.com",
    },
    {
      id: "P013",
      firstName: "Mia",
      lastName: "Anderson",
      department: "Marketing",
      email: "mia@company.com",
    },
    {
      id: "P014",
      firstName: "Noah",
      lastName: "Thomas",
      department: "Sales",
      email: "noah@company.com",
    },
    {
      id: "P015",
      firstName: "Olivia",
      lastName: "Taylor",
      department: "Engineering",
      email: "olivia@company.com",
    },
    {
      id: "P016",
      firstName: "Peter",
      lastName: "Moore",
      department: "Finance",
      email: "peter@company.com",
    },
    {
      id: "P017",
      firstName: "Quinn",
      lastName: "Jackson",
      department: "HR",
      email: "quinn@company.com",
    },
    {
      id: "P018",
      firstName: "Rachel",
      lastName: "Martin",
      department: "Engineering",
      email: "rachel@company.com",
    },
    {
      id: "P019",
      firstName: "Sam",
      lastName: "Lee",
      department: "Marketing",
      email: "sam@company.com",
    },
    {
      id: "P020",
      firstName: "Tara",
      lastName: "Walker",
      department: "Sales",
      email: "tara@company.com",
    },
    {
      id: "P021",
      firstName: "Uma",
      lastName: "Hall",
      department: "Engineering",
      email: "uma@company.com",
    },
    {
      id: "P022",
      firstName: "Victor",
      lastName: "Allen",
      department: "Finance",
      email: "victor@company.com",
    },
    {
      id: "P023",
      firstName: "Wendy",
      lastName: "Young",
      department: "HR",
      email: "wendy@company.com",
    },
    {
      id: "P024",
      firstName: "Xavier",
      lastName: "King",
      department: "Engineering",
      email: "xavier@company.com",
    },
    {
      id: "P025",
      firstName: "Yara",
      lastName: "Wright",
      department: "Marketing",
      email: "yara@company.com",
    },
    {
      id: "P026",
      firstName: "Zach",
      lastName: "Scott",
      department: "Sales",
      email: "zach@company.com",
    },
    {
      id: "P027",
      firstName: "Amy",
      lastName: "Green",
      department: "Engineering",
      email: "amy@company.com",
    },
    {
      id: "P028",
      firstName: "Ben",
      lastName: "Baker",
      department: "Finance",
      email: "ben@company.com",
    },
    {
      id: "P029",
      firstName: "Clara",
      lastName: "Adams",
      department: "HR",
      email: "clara@company.com",
    },
    {
      id: "P030",
      firstName: "David",
      lastName: "Nelson",
      department: "Engineering",
      email: "david@company.com",
    },
    {
      id: "P031",
      firstName: "Alice",
      lastName: "Johnson",
      department: "HR",
      email: "alice.johnson@company.com",
    },
    {
      id: "P032",
      firstName: "Brian",
      lastName: "Smith",
      department: "Engineering",
      email: "brian.smith@company.com",
    },
    {
      id: "P033",
      firstName: "Clara",
      lastName: "Williams",
      department: "Finance",
      email: "clara.williams@company.com",
    },
    {
      id: "P034",
      firstName: "Daniel",
      lastName: "Brown",
      department: "Marketing",
      email: "daniel.brown@company.com",
    },
    {
      id: "P035",
      firstName: "Ella",
      lastName: "Davis",
      department: "Sales",
      email: "ella.davis@company.com",
    },
    {
      id: "P036",
      firstName: "Frank",
      lastName: "Miller",
      department: "Engineering",
      email: "frank.miller@company.com",
    },
    {
      id: "P037",
      firstName: "Grace",
      lastName: "Wilson",
      department: "HR",
      email: "grace.wilson@company.com",
    },
    {
      id: "P038",
      firstName: "Henry",
      lastName: "Moore",
      department: "Finance",
      email: "henry.moore@company.com",
    },
    {
      id: "P039",
      firstName: "Isabella",
      lastName: "Taylor",
      department: "Marketing",
      email: "isabella.taylor@company.com",
    },
    {
      id: "P040",
      firstName: "Jack",
      lastName: "Anderson",
      department: "Sales",
      email: "jack.anderson@company.com",
    },
    {
      id: "P041",
      firstName: "Karen",
      lastName: "Thomas",
      department: "Engineering",
      email: "karen.thomas@company.com",
    },
    {
      id: "P042",
      firstName: "Leo",
      lastName: "Jackson",
      department: "HR",
      email: "leo.jackson@company.com",
    },
    {
      id: "P043",
      firstName: "Mia",
      lastName: "White",
      department: "Finance",
      email: "mia.white@company.com",
    },
    {
      id: "P044",
      firstName: "Noah",
      lastName: "Harris",
      department: "Marketing",
      email: "noah.harris@company.com",
    },
    {
      id: "P045",
      firstName: "Olivia",
      lastName: "Martin",
      department: "Sales",
      email: "olivia.martin@company.com",
    },
    {
      id: "P046",
      firstName: "Paul",
      lastName: "Thompson",
      department: "Engineering",
      email: "paul.thompson@company.com",
    },
    {
      id: "P047",
      firstName: "Quinn",
      lastName: "Garcia",
      department: "HR",
      email: "quinn.garcia@company.com",
    },
    {
      id: "P048",
      firstName: "Rachel",
      lastName: "Martinez",
      department: "Finance",
      email: "rachel.martinez@company.com",
    },
    {
      id: "P049",
      firstName: "Samuel",
      lastName: "Robinson",
      department: "Marketing",
      email: "samuel.robinson@company.com",
    },
    {
      id: "P050",
      firstName: "Tina",
      lastName: "Clark",
      department: "Sales",
      email: "tina.clark@company.com",
    },
    {
      id: "P051",
      firstName: "Umar",
      lastName: "Rodriguez",
      department: "Engineering",
      email: "umar.rodriguez@company.com",
    },
    {
      id: "P052",
      firstName: "Vera",
      lastName: "Lewis",
      department: "HR",
      email: "vera.lewis@company.com",
    },
    {
      id: "P053",
      firstName: "William",
      lastName: "Lee",
      department: "Finance",
      email: "william.lee@company.com",
    },
    {
      id: "P054",
      firstName: "Xenia",
      lastName: "Walker",
      department: "Marketing",
      email: "xenia.walker@company.com",
    },
    {
      id: "P055",
      firstName: "Yara",
      lastName: "Hall",
      department: "Sales",
      email: "yara.hall@company.com",
    },
    {
      id: "P056",
      firstName: "Zane",
      lastName: "Allen",
      department: "Engineering",
      email: "zane.allen@company.com",
    },
    {
      id: "P057",
      firstName: "Ava",
      lastName: "Young",
      department: "HR",
      email: "ava.young@company.com",
    },
    {
      id: "P058",
      firstName: "Ben",
      lastName: "Hernandez",
      department: "Finance",
      email: "ben.hernandez@company.com",
    },
    {
      id: "P059",
      firstName: "Cathy",
      lastName: "King",
      department: "Marketing",
      email: "cathy.king@company.com",
    },
    {
      id: "P060",
      firstName: "David",
      lastName: "Wright",
      department: "Sales",
      email: "david.wright@company.com",
    },
  ]);

  const totalEmployees = computed(() => employees.value.length);

  const findEmployeeById = (id: string): Employee | undefined => {
    return employees.value.find((emp) => emp.id === id);
  };

  const findEmployeesByDepartment = (department: string): Employee[] => {
    return employees.value.filter((emp) => emp.department === department);
  };

  const generateNextEmployeeId = (): string => {
    const maxId = Math.max(
      ...employees.value.map((e) => parseInt(e.id.replace("P", "")) || 0)
    );
    return `P${String(maxId + 1).padStart(3, "0")}`;
  };

  const addEmployee = (employee: Omit<Employee, "id">): Employee => {
    const newEmployee = {
      ...employee,
      id: generateNextEmployeeId()
    };
    employees.value.push(newEmployee);
    return newEmployee;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>): boolean => {
    const index = employees.value.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      employees.value[index] = { ...employees.value[index], ...updates };
      return true;
    }
    return false;
  };

  const deleteEmployee = (id: string): boolean => {
    const index = employees.value.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      employees.value.splice(index, 1);
      return true;
    }
    return false;
  };

  const getAllDepartments = (): string[] => {
    const departments = new Set(
      employees.value
        .map((emp) => emp.department)
        .filter((dept): dept is string => dept !== undefined)
    );
    return Array.from(departments).sort();
  };

  return {
    employees: readonly(employees),
    totalEmployees,
    findEmployeeById,
    findEmployeesByDepartment,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getAllDepartments,
    generateNextEmployeeId,
  };
};