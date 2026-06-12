import { Request, Response, NextFunction } from 'express';

function isPresent(val: any): boolean {
  return val !== undefined && val !== null && val !== '';
}

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
  const { name, gender } = req.body;
  const errors: string[] = [];

  if (!isPresent(name)) errors.push('Name is required');
  if (!isPresent(gender)) errors.push('Gender is required');
  if (gender && !['Male', 'Female'].includes(gender)) errors.push('Gender must be Male or Female');

  if (errors.length) {
    res.status(400).json({ error: errors.join('; ') });
    return;
  }
  next();
}

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const { name, phone, telegram, instagram } = req.body;
  if (!isPresent(name) && !isPresent(phone) && !isPresent(telegram) && !isPresent(instagram)) {
    res.status(400).json({ error: 'Name, phone, telegram, or instagram is required' });
    return;
  }
  next();
}

export function validatePayment(req: Request, res: Response, next: NextFunction): void {
  const { profileId, senderName, senderPhone, transactionId, method } = req.body;
  const errors: string[] = [];

  if (!isPresent(profileId)) errors.push('profileId is required');
  if (!isPresent(senderName)) errors.push('senderName is required');
  if (!isPresent(senderPhone)) errors.push('senderPhone is required');
  if (!isPresent(transactionId)) errors.push('transactionId is required');
  if (!isPresent(method)) errors.push('method is required');
  if (method && !['Telebirr', 'CBE Birr'].includes(method)) errors.push('method must be Telebirr or CBE Birr');

  if (errors.length) {
    res.status(400).json({ error: errors.join('; ') });
    return;
  }
  next();
}

export function validateAdminLogin(req: Request, res: Response, next: NextFunction): void {
  const { passcode } = req.body;
  if (!isPresent(passcode)) {
    res.status(400).json({ error: 'Passcode is required' });
    return;
  }
  next();
}

export function validatePasscodeUpdate(req: Request, res: Response, next: NextFunction): void {
  const { newPasscode } = req.body;
  if (!isPresent(newPasscode) || String(newPasscode).length < 4) {
    res.status(400).json({ error: 'Passcode must be at least 4 characters' });
    return;
  }
  next();
}

export function validateStory(req: Request, res: Response, next: NextFunction): void {
  const { coupleNames, story } = req.body;
  const errors: string[] = [];

  if (!isPresent(coupleNames)) errors.push('coupleNames is required');
  if (!isPresent(story)) errors.push('story is required');

  if (errors.length) {
    res.status(400).json({ error: errors.join('; ') });
    return;
  }
  next();
}
