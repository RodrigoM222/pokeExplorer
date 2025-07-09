import './CreatureModal.css';

type CreatureCardModalProps = {
    image: string;
    id: number;
    name: string;
    type: string;
  };
  
  export default function CreatureCardModal({ image, id, name, type }: CreatureCardModalProps) {
    return (
      <div className='card'>
        <img src={image} alt={`Imagen de ${name}`} />
        <p>#{id}</p>
        <ul>
          <li><p>Name: {name}</p></li>
          <li><p>Type: {type}</p></li>
        </ul>
      </div>
    );
}
 