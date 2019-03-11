declare module namespace{

    export interface question{
      id: number;
      questioner: String;
      question: String;
  
      firstAnswer: String;  
      secondAnswer: String; 
      thirdAnswer: String;
  
      firstValue: number; 
      secondValue: number; 
      thirdValue: number; 
    }
    
    export interface questionList{
        question: question;
    }

  }