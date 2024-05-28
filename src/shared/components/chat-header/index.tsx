interface IProps {
  chatterName?: string;
}

export function ChatModalHeader(props: IProps) {
  const { chatterName = 'Robot' } = props;
  return (
    <div className="p-6 text-white pb-3">
      <section className="flex justify-center">
        <span>Chat with {chatterName}</span>
      </section>
    </div>
  );
}
