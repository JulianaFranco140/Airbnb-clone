import Button from './Button';

export default function SocialButton({ provider, icon, children, onClick, ...props }) {
  return (
    <Button variant="social" onClick={onClick} {...props}>
      {icon && <span style={{ width: '20px', height: '20px' }}>{icon}</span>}
      <span>{children}</span>
    </Button>
  );
}
