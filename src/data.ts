export const testQuestionsData = [
  {
    id: "KG-01",
    category: "KnowledgeGeneral",
    question: "Hola",
    expected_response:
      "¡Hola! Soy el asistente virtual del consultorio. ¿En qué puedo ayudarte hoy?",
  },
  {
    id: "KG-02",
    category: "KnowledgeGeneral",
    question: "Qué servicios ofrecen?",
    expected_response:
      "Ofrecemos consultas presenciales y virtuales, procedimientos ambulatorios y atención de seguimiento. Si me dices qué necesitas, te guío mejor.",
  },
  {
    id: "KG-03",
    category: "KnowledgeGeneral",
    question: "Atienden los sábados?",
    expected_response:
      "Sí, contamos con agenda los sábados en horario reducido. ¿En qué ciudad te encuentras para validar disponibilidad?",
  },
  {
    id: "KG-04",
    category: "KnowledgeGeneral",
    question: "Dónde están ubicados?",
    expected_response:
      "Tenemos varias sedes. ¿En qué ciudad o zona te encuentras para indicarte la dirección más cercana?",
  },
  {
    id: "KG-05",
    category: "KnowledgeGeneral",
    question: "Atienden urgencias?",
    expected_response:
      "Podemos orientar y priorizar casos, pero para emergencias severas te recomiendo acudir a un servicio de urgencias. Si es un caso urgente no crítico, puedo ayudarte a conseguir la primera cita disponible.",
  },
  {
    id: "KG-06",
    category: "KnowledgeGeneral",
    question: "Cuáles son los métodos de pago?",
    expected_response:
      "Aceptamos tarjetas débito y crédito, transferencia y efectivo. Algunos procedimientos pueden pagarse a plazos según la sede.",
  },
  {
    id: "KG-07",
    category: "KnowledgeGeneral",
    question: "Trabajan con aseguradoras o solo particular?",
    expected_response:
      "Trabajamos con aseguradoras seleccionadas y también atendemos a pacientes particulares. Puedo verificar si tu póliza aplica; ¿con qué aseguradora estás?",
  },
  {
    id: "KG-08",
    category: "KnowledgeGeneral",
    question: "Qué especialidades tienen?",
    expected_response:
      "Contamos con varias especialidades clínicas. Si me dices cuál buscas, te doy detalles y disponibilidad.",
  },
  {
    id: "KG-09",
    category: "KnowledgeGeneral",
    question: "Se pueden hacer consultas virtuales?",
    expected_response:
      "Sí, ofrecemos teleconsulta para evaluaciones iniciales y controles. ¿Quieres que te proponga horarios?",
  },
  {
    id: "KG-10",
    category: "KnowledgeGeneral",
    question: "Cuál es el horario de atención?",
    expected_response:
      "Atendemos de lunes a viernes en jornada continua y sábados en horario reducido. ¿Qué día te interesa?",
  },
  {
    id: "KG-11",
    category: "KnowledgeGeneral",
    question: "Cuánto cuesta la consulta?",
    expected_response:
      "El valor depende de la especialidad y la sede. Puedo cotizarte si me indicas el servicio y tu ciudad.",
  },
  {
    id: "KG-12",
    category: "KnowledgeGeneral",
    question: "Tienen promociones vigentes?",
    expected_response:
      "Algunas sedes manejan promociones por temporada. ¿Sobre qué servicio te gustaría saber para confirmarte?",
  },
  {
    id: "KG-13",
    category: "KnowledgeGeneral",
    question: "Atienden en días festivos?",
    expected_response:
      "En festivos solo manejamos agenda especial según la sede. ¿Deseas que verifique para tu ciudad?",
  },
  {
    id: "KG-14",
    category: "KnowledgeGeneral",
    question: "Cómo puedo agendar una cita?",
    expected_response:
      "Puedo agendarla por aquí. Solo necesito tu nombre completo, teléfono, ciudad, servicio y rango de horario preferido.",
  },
  {
    id: "KG-15",
    category: "KnowledgeGeneral",
    question: "Hay disponibilidad esta semana?",
    expected_response:
      "Sí, puedo revisar y proponerte horarios esta semana. ¿Qué días y franjas te sirven?",
  },
  {
    id: "KG-16",
    category: "KnowledgeGeneral",
    question: "Atienden a niños?",
    expected_response:
      "Sí, contamos con profesionales capacitados para pacientes pediátricos. ¿Para qué servicio necesitas la cita?",
  },
  {
    id: "KG-17",
    category: "KnowledgeGeneral",
    question: "Cuánto dura la consulta?",
    expected_response:
      "La consulta suele durar entre 20 y 40 minutos, según el caso y la especialidad.",
  },

  {
    id: "KS-01",
    category: "KnowledgeSpecific",
    question: "Qué ofrecen en <limpieza dental>?",
    expected_response:
      "La <limpieza dental> incluye evaluación, profilaxis y recomendaciones personalizadas de cuidado. ¿Quieres agendar una valoración?",
  },
  {
    id: "KS-02",
    category: "KnowledgeSpecific",
    question: "Tienen el servicio de <limpieza dental>?",
    expected_response:
      "Sí, contamos con <limpieza dental> en varias sedes. ¿En qué ciudad te encuentras para ver disponibilidad?",
  },
  {
    id: "KS-03",
    category: "KnowledgeSpecific",
    question: "En qué consiste el tratamiento de <limpieza dental>?",
    expected_response:
      "La <limpieza dental> remueve placa y sarro, ayuda a prevenir caries y mejora la salud de las encías. El procedimiento es ambulatorio.",
  },
  {
    id: "KS-04",
    category: "KnowledgeSpecific",
    question: "Cuánto cuesta el servicio de <limpieza dental>?",
    expected_response:
      "El costo de <limpieza dental> varía por sede y profesional. Puedo cotizarte si me indicas tu ciudad.",
  },
  {
    id: "KS-05",
    category: "KnowledgeSpecific",
    question: "Atienden los sábados para <limpieza dental>?",
    expected_response:
      "Sí, algunos sábados tenemos agenda para <limpieza dental>. ¿Te propongo horarios?",
  },
  {
    id: "KS-06",
    category: "KnowledgeSpecific",
    question: "Tiene promociones vigentes para <limpieza dental>?",
    expected_response:
      "A veces hay promociones por temporada. Verifico para tu sede si hay descuentos en <limpieza dental>.",
  },

  {
    id: "C-01",
    category: "Conversational",
    question: "Gracias",
    expected_response: "¡Con gusto! ¿Te ayudo a reservar tu cita ahora?",
  },
  {
    id: "C-02",
    category: "Conversational",
    question: "Quiero saber más antes de agendar",
    expected_response:
      "Claro. ¿Sobre qué aspecto te gustaría más información: procedimiento, costos, tiempos o contraindicaciones?",
  },
  {
    id: "C-03",
    category: "Conversational",
    question: "Qué hago si nunca he ido antes?",
    expected_response:
      "No te preocupes, agendamos una valoración inicial y el profesional te indicará el plan de manejo. ¿Te reservo un cupo?",
  },
  {
    id: "C-04",
    category: "Conversational",
    question: "Y si tengo dudas después de la consulta?",
    expected_response:
      "Puedes escribirnos por este medio o solicitar una teleconsulta de control. Estamos para acompañarte.",
  },
  {
    id: "C-05",
    category: "Conversational",
    question: "Qué pasa si no puedo asistir a la cita?",
    expected_response:
      "Puedes reprogramarla hasta 24 horas antes sin costo. ¿Quieres que mueva tu cita?",
  },
  {
    id: "C-06",
    category: "Conversational",
    question: "Me puedes explicar mejor?",
    expected_response:
      "Con gusto. ¿Qué parte te gustaría que detalle? Puedo darte una explicación paso a paso.",
  },
  {
    id: "C-07",
    category: "Conversational",
    question: "Puedo hablar con alguien directamente?",
    expected_response:
      "Sí, puedo pedir que te contacten por teléfono o WhatsApp. ¿Me compartes tu número y mejor horario?",
  },

  {
    id: "CA-01",
    category: "CRUDAgendamiento",
    question: "Cómo puedo agendar una cita para <limpieza dental>?",
    expected_response:
      "Puedo agendarla ahora. Compárteme tu nombre, teléfono, ciudad y el rango de horario preferido.",
  },
  {
    id: "CA-02",
    category: "CRUDAgendamiento",
    question: "Tienen citas para el lunes para <limpieza dental>?",
    expected_response:
      "Reviso disponibilidad del lunes para <limpieza dental>. ¿Prefieres mañana, tarde o noche?",
  },
  {
    id: "CA-03",
    category: "CRUDAgendamiento",
    question: "Qué disponibilidad hay para la sede centro?",
    expected_response:
      "Para sede Centro tengo cupos esta semana en mañanas y tardes. ¿Cuál te conviene?",
  },
  {
    id: "CA-04",
    category: "CRUDAgendamiento",
    question: "Quiero reagendar mi cita para el sábado",
    expected_response:
      "Con gusto. ¿A qué hora te funciona el sábado? Verifico y confirmo.",
  },
  {
    id: "CA-05",
    category: "CRUDAgendamiento",
    question: "Tengo citas programadas?",
    expected_response:
      "Puedo revisarlo. Por favor indícame tu nombre completo y documento o teléfono.",
  },
  {
    id: "CA-06",
    category: "CRUDAgendamiento",
    question: "Quiero cancelar mi cita",
    expected_response:
      "Entendido. ¿Confirmas el nombre y fecha de la cita para proceder a cancelarla?",
  },

  {
    id: "OOC-01",
    category: "OutOfContext",
    question: "Cuál es la capital de Japón?",
    expected_response:
      "Puedo ayudarte con temas del consultorio y agendamiento. ¿Deseas información de servicios o reservar una cita?",
  },
  {
    id: "OOC-02",
    category: "OutOfContext",
    question: "Qué es Bitcoin?",
    expected_response:
      "Mi función es gestionar información clínica y citas. ¿Quieres que te ayude a agendar o resolver dudas sobre nuestros servicios?",
  },
  {
    id: "OOC-03",
    category: "OutOfContext",
    question: "Recomiéndame una serie en Netflix",
    expected_response:
      "Estoy aquí para temas de salud y citas. ¿Te comparto horarios disponibles?",
  },
  {
    id: "OOC-04",
    category: "OutOfContext",
    question: "Te gusta el fútbol?",
    expected_response:
      "Puedo asistirte con consultas y agendamiento. ¿Qué servicio te interesa?",
  },
  {
    id: "OOC-05",
    category: "OutOfContext",
    question: "Me prestas tu estetoscopio? 😂",
    expected_response:
      "No puedo facilitar equipos, pero sí ayudarte a programar una valoración. ¿Deseas agendar?",
  },
  {
    id: "OOC-06",
    category: "OutOfContext",
    question: "Cuéntame un chiste",
    expected_response:
      "Me enfoco en tu atención en salud. ¿Quieres que revisemos disponibilidad para una cita?",
  },
  {
    id: "OOC-07",
    category: "OutOfContext",
    question: "Qué opinas de los aliens?",
    expected_response:
      "Solo gestiono información clínica y citas. ¿Te ayudo con algún servicio?",
  },
  {
    id: "OOC-08",
    category: "OutOfContext",
    question: "🐶🐱💉🤖",
    expected_response:
      "¿Podrías decirme en qué servicio del consultorio necesitas ayuda?",
  },
  {
    id: "OOC-09",
    category: "OutOfContext",
    question: "Quiero comprar empanadas, me ayudas?",
    expected_response:
      "Puedo apoyarte con servicios de salud y agendamiento. ¿Deseas reservar una consulta?",
  },
  {
    id: "OOC-10",
    category: "OutOfContext",
    question: "Sabes dónde venden pañales?",
    expected_response:
      "Puedo orientarte en servicios del consultorio. Si necesitas una valoración, puedo agendarte.",
  },
  {
    id: "OOC-11",
    category: "OutOfContext",
    question: "Eres un idiota, son unos estafadores y un pinche mamón",
    expected_response:
      "Lamento que te sientas así. Puedo ayudarte con información o agendar una cita. Si prefieres, puedo escalar tu caso a un asesor humano.",
  },
];
