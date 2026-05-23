'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Cómo funciona la evaluación de IA?",
    answer: "Nuestra Inteligencia Artificial analiza los videos que subes utilizando modelos de visión por computadora para medir métricas clave como velocidad, aceleración, técnica y posicionamiento táctico, brindando un puntaje objetivo."
  },
  {
    question: "¿Mis videos e información son privados?",
    answer: "Sí. Tú tienes control total sobre quién puede ver tu perfil. Solo los scouts y clubes verificados en nuestra plataforma pueden acceder a tus métricas y videos completos."
  },
  {
    question: "¿Cuánto cuesta para los atletas?",
    answer: "Crear tu perfil, subir videos y recibir la evaluación básica de IA es 100% gratuito. Creemos en democratizar el acceso a las oportunidades."
  },
  {
    question: "¿Qué información necesito cargar?",
    answer: "Para empezar, solo necesitas tus datos básicos, medidas físicas y al menos un video de buena calidad donde se aprecie tu desempeño en situaciones de juego o entrenamiento."
  },
  {
    question: "¿Puedo ser descubierto en cualquier deporte?",
    answer: "Actualmente soportamos Fútbol y Baloncesto, pero estamos trabajando para añadir Voleibol, Tenis, Atletismo y otros deportes en los próximos meses."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg text-muted-foreground">
            Resolvemos tus dudas sobre cómo funciona Kuntur-Tech.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
              <AccordionTrigger className="text-left text-base md:text-lg hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
      </div>
    </section>
  );
}
